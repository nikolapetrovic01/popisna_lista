import {Component, OnInit} from '@angular/core';
import {ListInventoryItemComponent} from "../../../controller/inventories/list-inventory-item/list-inventory-item.component";
import {NgForOf, NgIf} from "@angular/common";
import {item, items, updateItemAmount} from "../../../../dto/item";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../service/inventory.service";
import {
  WorkerInventoryListItemComponent
} from "../../inventory/worker-inventory-list-item/worker-inventory-list-item.component";
import {ConfirmModalWorkerLockedItemClickedComponent} from "../../../shared/confirm-modal/confirm-modal-worker-locked-item-clicked.component";

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-lower-level-inventory',
  standalone: true,
  imports: [
    ListInventoryItemComponent,
    NgForOf,
    WorkerInventoryListItemComponent,
    ConfirmModalWorkerLockedItemClickedComponent,
    NgIf
  ],
  templateUrl: './worker-lower-level-inventory.component.html',
  styleUrl: './worker-lower-level-inventory.component.css'
})
export class WorkerLowerLevelInventoryComponent implements OnInit{
  itemId: number | null = null;
  items: item[] = [];
  searchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number = 0;
  editStateMap: { [key: number]: boolean } = {};
  showModal: boolean = false;
  modalMessage: string = '';

  constructor(private route: ActivatedRoute,
              private inventoryService: InventoryService,) {}

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
        },
        error: err => {
          console.error(err);
        }
      });
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
   * Saves changes and locks edited items.
   */
  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveWorkerChangedItems(this.updatedItems).subscribe({
        next: () => {
          this.items.forEach(item => {
            this.editStateMap[item.itemId] = (item.itemInputtedAmount === -1); // 🔹 Only editable if -1
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
