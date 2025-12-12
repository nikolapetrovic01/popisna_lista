import {Component, HostListener, NgZone, OnDestroy, OnInit} from '@angular/core';
import {DropdownItemComponent} from "../dropdown-item/dropdown-item.component";
import {InventoryService} from "../../../service/inventory.service";
import {item, items, updateItemAmount} from "../../../dto/item";
import {ListInventoryItemComponent} from "./list-inventory-item/list-inventory-item.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  ConfirmModalWorkerLockedItemClickedComponent
} from "../../shared/confirm-modal-worker/confirm-modal-worker-locked-item-clicked.component";
import {LoadingSpinnerComponent} from "../../shared/loading-spinner/loading-spinner.component";

// Define the custom event type for TypeScript
interface BarcodeCustomEvent extends CustomEvent {
  detail: string;
}

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [
    ListInventoryItemComponent,
    CommonModule,
    FormsModule,
    ConfirmModalWorkerLockedItemClickedComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent implements OnInit, OnDestroy {
  items: item[] = [];
  itemId: number | null = null;
  isEditable: boolean = false;
  nameSearchTerm: string = '';
  barcodeSearchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number;
  showModalItemChanged: boolean = false;
  showModalInventoryClose: boolean = false;
  modalMessage: string = '';
  modalConfirmationMessage: string = '';
  modalNegationMessage: string = '';
  modalShown: boolean = false;
  oldItem: item | null = null;
  loading: boolean = true;
  savedNegativeItems: Set<number> = new Set();
  myCheckboxValue: boolean = false;

  isAndroidApp: boolean = false; //Flag to show/hide the button
  private barcodeListener: (event: Event) => void= () => {};

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.changedItems = 0;
  }

  /**
   * Initializes the component, fetches items if an inventory ID is present in the route.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const fromActive = this.route.snapshot.queryParamMap.get('fromActive');

    if (id !== null) {
      this.itemId = +id;
      this.isEditable = fromActive === 'true';
      this.inventoryService.getItems(this.itemId).subscribe({
        next: (data: items) => {
          this.items = data.items.map(item => ({
            ...item,
            modalTriggered: false
          }));
          this.items.forEach(item => {
            if (item.itemInputtedAmount === -1) {
              this.savedNegativeItems.add(item.itemId);
            }
          })

          this.changedItems = this.items.filter((item) => item.itemInputtedAmount != -1).length;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
        }
      })
      ;
    }

    // 1. Check for the native Android interface object
    if ((window as any).AndroidInterface && (window as any).AndroidInterface.scanBarcode) {
      this.isAndroidApp = true;
    }

    this.barcodeListener = (event: Event) => {
      // Cast the event to the custom type for detail access
      const customEvent = event as BarcodeCustomEvent;
      const scannedCode = customEvent.detail;

      // Ensure execution is within Angular's change detection zone.
      this.ngZone.run(() => {
        // Set the model and trigger the filter/update
        this.barcodeSearchTerm = scannedCode;
      });
    };

    // Attach the listener to the global window object
    window.addEventListener('barcodeScanned', this.barcodeListener);
  }

  ngOnDestroy(): void {
    if (this.barcodeListener) {
      window.removeEventListener('barcodeScanned', this.barcodeListener);
    }
  }

  triggerScan() {
    if (this.isAndroidApp) {
      // Call the Java bridge method you defined in MainActivity
      // The interface object is named 'AndroidInterface' in your Java code
      (window as any).AndroidInterface.scanBarcode();
    }
  }

  /**
   * Filters the list of items based on the search term entered by the user.
   * @returns  An array of items that match the search term
   */
  filteredItems(): item[] {
    if (!this.nameSearchTerm && !this.barcodeSearchTerm && !this.myCheckboxValue) {
      return this.items; // Reset to all items when both are cleared
    }

    return this.items.filter((item) => {
      const nameMatches = this.nameSearchTerm.trim() === '' ||
        item.itemName.toLowerCase().includes(this.nameSearchTerm.toLowerCase());

      const barcodeMatches = typeof this.barcodeSearchTerm === 'string' && this.barcodeSearchTerm.trim() === '' ||
        (!isNaN(Number(this.barcodeSearchTerm)) && item.itemBarcode.includes(this.barcodeSearchTerm));

      const amountMatches =
        !this.myCheckboxValue || item.itemInputtedAmount <= -1;

      return nameMatches && barcodeMatches && amountMatches;
    });
  }

  /**
   * Handles when "Close Inventory" button is clicked.
   */
  handleActivateModalOnCloseInventory() {
    this.showModalInventoryClose = true;
    this.modalMessage = 'Da li želite da zaključite ovaj inventar?';
    this.modalConfirmationMessage = 'Da želim.';
    this.modalNegationMessage = 'Ne želim';
  }

  handleModalConfirmInventoryClose(answer: boolean) {
    console.log("It was clicked and the answer is " + answer);
    this.showModalInventoryClose = false;
    if (  answer) {
      this.closeOpenedInventory()
    }
  }

  handleInputFocus(item: item) {
    if (item.itemInputtedAmount != null) {
      this.oldItem = {...item};
    }
    this.modalShown = false;
  }

  /**
   * Handles when a changed item is clicked.
   */
  handleActivateModalOnChangeItem() {
    this.showModalItemChanged = true;
    this.modalMessage = 'Ovaj artikl je već promjenjen!';
    this.modalConfirmationMessage = 'U redu, promjeni.';
    this.modalNegationMessage = 'Ne mjenjaj.';
  }

  /**
   * Handles the confirmation result from the modal.
   */
  handleModalConfirmItemChanged(answer: boolean) {
    console.log("handleModalConfirm answer is " + answer + " and old item is " + this.oldItem?.itemInputtedAmount)
    if (!answer && this.oldItem) {
      const item = this.items.find(i => i.itemId === this.oldItem!.itemId);
      console.log("found item in the items " + item?.itemInputtedAmount)
      if (item) {
        console.log("Reseting value to " + this.oldItem!.itemInputtedAmount)
        item.itemInputtedAmount = this.oldItem!.itemInputtedAmount;
      }

      // Remove from updatedItems if present
      this.updatedItems = this.updatedItems.filter(i => i.itemId !== this.oldItem!.itemId);
      this.modalShown = false;
      }

    if (answer) {
      this.modalShown = true;
      const item = this.items.find(i => i.itemId === this.oldItem!.itemId);
      if (item) {
        item.modalTriggered = true;   // <-- FIX
      }
    }

    this.showModalItemChanged = false;
  }

  handleItemChange(updatedItem: updateItemAmount) {
    const original = this.items.find(i => i.itemId === updatedItem.itemId);
    console.log("handleItemChange original item " + original?.itemId +
      " and the updateItem " + updatedItem.itemId)

    if (original && this.savedNegativeItems.has(updatedItem.itemId)) {
      const  index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
      if (index !== -1) {
        this.updatedItems[index] = updatedItem;
      } else {
        this.updatedItems.push(updatedItem);
      }
      return;
    }
    console.log("HandleItemChange odlItem is: " + this.oldItem?.itemInputtedAmount + " and original modal triggered value is " + !original?.modalTriggered)
    if (this.oldItem?.itemInputtedAmount !== -1 && !original?.modalTriggered) {
      this.handleActivateModalOnChangeItem();
      // original!.modalTriggered = this.modalShown;
      return;
    }
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.updatedItems[index] = updatedItem;
    } else {
      this.updatedItems.push(updatedItem);
    }
  }

  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveChangedItems(this.updatedItems).subscribe({
        next: () => {
          this.updatedItems.forEach(item => {
            this.savedNegativeItems.delete(item.itemId);

            const saved = this.items.find(i => i.itemId === item.itemId);
            if (saved) {
              saved.modalTriggered = false;
            }
          });

          this.updatedItems = [];
          this.changedItems = this.items.filter((item) => item.itemInputtedAmount != -1).length;
        },
        error: err => {
          console.error('Error saving changes', err);
        }
      });
    } else {
      console.log("No changes to save");
    }
  }

  /**
   * Closes the opened inventory.
   */
  closeOpenedInventory(): void {

    const id: number | null = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    if (id !== null) {
      this.inventoryService.closeInventory(id).subscribe({
        next: () => {
          this.router.navigate(['/controller']);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/controller']);
  }
}
