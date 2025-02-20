import {Component, OnInit} from '@angular/core';
import {ListInventoryItemComponent} from "../../../../controller/inventories/list-inventory-item/list-inventory-item.component";
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

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-higher-level-inventory',
  standalone: true,
  imports: [
    ListInventoryItemComponent,
    NgForOf,
    WorkerInventoryListItemComponent,
    ConfirmModalWorkerLockedItemClickedComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './worker-higher-level-inventory.component.html',
  styleUrl: './worker-higher-level-inventory.component.css'
})
export class WorkerHigherLevelInventoryComponent implements OnInit{
  itemId: number | null = null;
  items: item[] = [];
  nameSearchTerm: string = '';
  barcodeSearchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number;
  showModal: boolean = false;
  modalMessage: string = '';
  oldItem: item | null = null;

  constructor(private route: ActivatedRoute,
              private inventoryService: InventoryService) {
    this.changedItems = 0;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id != null) {
      this.itemId = +id;
      this.inventoryService.getWorkerItems(this.itemId).subscribe({
        next: (data: items) => {
          this.items = data.items;
          this.changedItems = this.items.filter((item) => item.itemInputtedAmount != -1).length;
        },
        error: err => {
          console.error(err);
        }
      });
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
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (this.oldItem?.itemInputtedAmount !== -1) {
      this.handleActivateModal();
      return;
    }

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
    if (!this.nameSearchTerm && !this.barcodeSearchTerm) {
      return this.items; // Reset to all items when both are cleared
    }

    return this.items.filter((item) => {
      const nameMatches = this.nameSearchTerm.trim() === '' ||
        item.itemName.toLowerCase().includes(this.nameSearchTerm.toLowerCase());

      const barcodeMatches = typeof this.barcodeSearchTerm === 'string' && this.barcodeSearchTerm.trim() === '' ||
        (!isNaN(Number(this.barcodeSearchTerm)) && item.itemBarcode.includes(this.barcodeSearchTerm));

      return nameMatches && barcodeMatches;
    });
  }

  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveWorkerChangedItems(this.updatedItems).subscribe({
        next: () => {
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
