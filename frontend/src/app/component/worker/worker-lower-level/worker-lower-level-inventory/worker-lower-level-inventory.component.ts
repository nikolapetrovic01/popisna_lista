import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {item, items, updateItemAmount} from "../../../../dto/item";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../service/inventory.service";
import {
  WorkerInventoryListItemComponent
} from "../../inventory/worker-inventory-list-item/worker-inventory-list-item.component";
import {ConfirmModalWorkerLockedItemClickedComponent} from "../../../shared/confirm-modal-worker/confirm-modal-worker-locked-item-clicked.component";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../shared/loading-spinner/loading-spinner.component";

interface BarcodeCustomEvent extends CustomEvent {
  detail: string;
}

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-lower-level-inventory',
  standalone: true,
  imports: [
    NgForOf,
    WorkerInventoryListItemComponent,
    ConfirmModalWorkerLockedItemClickedComponent,
    NgIf,
    FormsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './worker-lower-level-inventory.component.html',
  styleUrl: './worker-lower-level-inventory.component.css'
})
export class WorkerLowerLevelInventoryComponent implements OnInit, OnDestroy {
  itemId: number | null = null;
  items: item[] = [];
  nameSearchTerm: string = '';
  barcodeSearchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number = 0;
  editStateMap: { [key: number]: boolean } = {};
  showModal: boolean = false;
  modalMessage: string = '';
  loading: boolean = true;
  myCheckboxValue: boolean = false;
  isAndroidApp: boolean = false; //Flag to show/hide the button
  private barcodeListener: (event: Event) => void= () => {};

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private ngZone: NgZone
    ) {}

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');

    if (id != null) {
      this.itemId = +id;
      this.inventoryService.getWorkerItems(this.itemId).subscribe({
        next: (data: items) => {
          this.items = data.items;
          this.items.forEach(item => {
            this.editStateMap[item.itemId] = (item.itemInputtedAmount === -1);
          });
          this.changedItems = this.items.filter((item) => item.itemInputtedAmount != -1).length;
          this.loading = false;
        },
        error: err => {
          console.error(err);
        }
      });
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
   * Handles when a locked item is clicked.
   */
  handleLockedItemClick() {
    this.showModal = true;
    this.modalMessage = 'Ovaj artikl je već promjenjen!';
  }

  /**
   * Handles the confirmation result from the modal.
   */
  handleModalConfirm() {
    this.showModal = false;
  }

  /**
   * Handles item changes and updates the list of modified items.
   */
  handleItemChange(updatedItem: updateItemAmount) {
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.updatedItems[index] = updatedItem; // Update existing entry
    } else {
      this.updatedItems.push(updatedItem); // Add new entry
    }
  }

  /**
   * Filters the list of items based on the search term entered by the user.
   * @returns - An array of items that match the search term
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
   * Saves changes and locks edited items.
   */
  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveWorkerChangedItems(this.updatedItems).subscribe({
        next: () => {
          this.items.forEach(item => {
            this.editStateMap[item.itemId] = (item.itemInputtedAmount === -1);
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
}
