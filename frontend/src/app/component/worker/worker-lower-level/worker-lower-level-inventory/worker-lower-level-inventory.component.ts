import {Component, OnInit} from '@angular/core';
import {ListInventoryItemComponent} from "../../../controller/inventories/list-inventory-item/list-inventory-item.component";
import {NgForOf} from "@angular/common";
import {item, items, updateItemAmount} from "../../../../dto/item";
import {ActivatedRoute, Router} from "@angular/router";
import {InventoryService} from "../../../../service/inventory.service";

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-lower-level-inventory',
  standalone: true,
  imports: [
    ListInventoryItemComponent,
    NgForOf
  ],
  templateUrl: './worker-lower-level-inventory.component.html',
  styleUrl: './worker-lower-level-inventory.component.css'
})
export class WorkerLowerLevelInventoryComponent implements OnInit{
  itemId: number | null = null;
  items: item[] = [];
  searchTerm: string = '';
  changedItems: updateItemAmount[] = [];

  constructor(private route: ActivatedRoute,
              private inventoryService: InventoryService,
              private router: Router) {
  }

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    if (id != null) {
      this.itemId = +id;
      this.inventoryService.getWorkerItems(this.itemId).subscribe({
        next: (data: items) => {
          this.items = data.items;
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  handleItemChange(updatedItem: updateItemAmount) {
    const index = this.changedItems.findIndex(i => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.changedItems[index] = updatedItem; // Update existing entry
    } else {
      this.changedItems.push(updatedItem); // Add new entry
    }
  }

  save() {
    if (this.changedItems.length > 0) {
      this.inventoryService.saveWorkerChangedItems(this.changedItems).subscribe({
        next: () => {
          console.log('All changes saved successfully');
          console.log(this.changedItems);
          this.changedItems = [];
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
