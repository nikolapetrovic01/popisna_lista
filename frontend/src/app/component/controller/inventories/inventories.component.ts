import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [
    DropdownItemComponent,
    ListInventoryItemComponent,
    CommonModule,
    FormsModule,
    ConfirmModalWorkerLockedItemClickedComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent implements OnInit {
  items: item[] = [];
  itemId: number | null = null;
  isEditable: boolean = false;
  nameSearchTerm: string = '';
  barcodeSearchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number;
  showModal: boolean = false;
  modalMessage: string = '';
  oldItem: item | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router
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
          this.items = data.items;
          this.changedItems = this.items.filter((item) => item.itemInputtedAmount != -1).length;
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
        }
      })
      ;
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

  handleItemChange(updatedItem: updateItemAmount) {
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (this.oldItem?.itemInputtedAmount !== -1) {
      this.handleActivateModal();
      return;
    }

    if (index !== -1) {
      this.updatedItems[index] = updatedItem; // Update existing entry
    } else {
      this.updatedItems.push(updatedItem); // Add new entry
    }
  }

  save() {
    if (this.updatedItems.length > 0) {
      this.inventoryService.saveChangedItems(this.updatedItems).subscribe({
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

  handleInputFocus(item: item) {
    console.log("Old value: " + item.itemInputtedAmount);
    this.oldItem = {...item};
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
}
