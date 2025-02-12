import {Component, OnInit} from '@angular/core';
import {ListInventoryItemComponent} from "../../../../controller/inventories/list-inventory-item/list-inventory-item.component";
import {NgForOf} from "@angular/common";
import {item, items, updateItemAmount} from "../../../../../dto/item";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../../service/inventory.service";

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-higher-level-inventory',
  standalone: true,
    imports: [
        ListInventoryItemComponent,
        NgForOf
    ],
  templateUrl: './worker-higher-level-inventory.component.html',
  styleUrl: './worker-higher-level-inventory.component.css'
})
export class WorkerHigherLevelInventoryComponent implements OnInit{
  itemId: number | null = null;
  items: item[] = [];
  searchTerm: string = '';
  updatedItems: updateItemAmount[] = [];
  changedItems: number;

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

  handleItemChange(updatedItem: updateItemAmount) {
    const index = this.updatedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.updatedItems[index] = updatedItem; // Update existing entry
    } else {
      this.updatedItems.push(updatedItem); // Add new entry
    }
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
