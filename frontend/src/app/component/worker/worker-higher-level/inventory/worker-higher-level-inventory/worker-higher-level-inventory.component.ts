import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {item, items, updateItemAmount} from "../../../../../dto/item";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../../service/inventory.service";
import {
  WorkerInventoryListItemComponent
} from "../../../inventory/worker-inventory-list-item/worker-inventory-list-item.component";
import {
  ConfirmModalWorkerLockedItemClickedComponent
} from "../../../../shared/confirm-modal-worker/confirm-modal-worker-locked-item-clicked.component";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../../../../shared/loading-spinner/loading-spinner.component";

// Define the custom event type for TypeScript
interface BarcodeCustomEvent extends CustomEvent {
  detail: string;
}

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-higher-level-inventory',
  standalone: true,
  imports: [
    NgForOf,
    WorkerInventoryListItemComponent,
    ConfirmModalWorkerLockedItemClickedComponent,
    NgIf,
    FormsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './worker-higher-level-inventory.component.html',
  styleUrl: './worker-higher-level-inventory.component.css'
})
export class WorkerHigherLevelInventoryComponent implements OnInit, OnDestroy {
  itemId: number | null = null;
  items: item[] = [];
  savedNegativeItems: Set<number> = new Set();
  nameSearchTerm: string = '';
  barcodeSearchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number;
  showModal: boolean = false;
  modalMessage: string = '';
  oldItem: item | null = null;
  loading: boolean = true;
  myCheckboxValue: boolean = false;
  isAndroidApp: boolean = false; //Flag to show/hide the button
  private barcodeListener: (event: Event) => void= () => {};

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private ngZone: NgZone
  ) {
    this.changedItems = 0;
  }

  ngOnInit() {
    window.addEventListener('barcodeScanned', (event: any) => {
      this.barcodeSearchTerm = event.detail;
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    if (id != null) {
      this.itemId = +id;
      this.inventoryService.getWorkerItems(this.itemId).subscribe({
        next: (data: items) => {
          this.items = data.items.map(item => ({
            ...item,
            modalTriggered: false // Ensure each item starts with modalTriggered = false
          }));

          this.items.forEach(item => {
            if (item.itemInputtedAmount === -1) {
              this.savedNegativeItems.add(item.itemId);
            }
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

  handleInputFocus(item: item) {
    console.log("Old value: " + item.itemInputtedAmount);
    this.oldItem = { ...item };
  }

  /**
   * Handles when a changed item is clicked.
   */
  handleActivateModal() {
    this.showModal = true;
    this.modalMessage = 'Ovaj artikl je već promjenjen!';
  }

  /**
   * Handles the confirmation result from the modal.
   */
  handleModalConfirm(answer: boolean) {
    if (!answer && this.oldItem) {
      const item = this.items.find(i => i.itemId === this.oldItem!.itemId);
      if (item) {
        item.itemInputtedAmount = this.oldItem!.itemInputtedAmount; // Restore old value
      }

      // Remove from updatedItems if present
      this.updatedItems = this.updatedItems.filter(i => i.itemId !== this.oldItem!.itemId);
    }

    this.showModal = false;
  }

  /**
   * Handles item changes and updates the list of modified items.
   */
  handleItemChange(updatedItem: updateItemAmount) {
    const originalItem = this.items.find(i => i.itemId === updatedItem.itemId);

    if (originalItem && this.savedNegativeItems.has(updatedItem.itemId)) {
      const  index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
      if (index !== -1) {
          this.updatedItems[index] = updatedItem;
        } else {
          this.updatedItems.push(updatedItem);
        }
      return;
    }

    if (this.oldItem?.itemInputtedAmount !== -1 && !originalItem?.modalTriggered) {
      originalItem!.modalTriggered = true;
      this.handleActivateModal();
      return;
    }
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.updatedItems[index] = updatedItem;
    } else {
      this.updatedItems.push(updatedItem);
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
        !this.myCheckboxValue || item.itemInputtedAmount > -1;

      return nameMatches && barcodeMatches && amountMatches;
    });
  }

  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveWorkerChangedItems(this.updatedItems).subscribe({
        next: () => {
          this.updatedItems.forEach(item => {
            this.savedNegativeItems.delete(item.itemId); // Remove from tracking
            // Reset modalTriggered after saving
            const savedItem = this.items.find(i => i.itemId === item.itemId);
            if (savedItem) {
              savedItem.modalTriggered = false;
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
}
