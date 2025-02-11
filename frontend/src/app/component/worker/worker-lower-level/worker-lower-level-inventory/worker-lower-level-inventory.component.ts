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

  save(){
    // this.router.navigate(['/worker/dashboard']).catch(err => console.log("The error: ", err));
    this.saveChangedItems()
  }

  saveChangedItems() {
    this.inventoryService.saveWorkerChangedItems(this.items).subscribe({
      next: () => console.log("Changes saved successfully."),
      error: err => console.error("Error saving changes:", err)
    });
  }

}
