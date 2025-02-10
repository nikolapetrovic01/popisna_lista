import {Component, OnInit} from '@angular/core';
import {
  ListInventoryItemComponent
} from "../../../controller/inventories/list-inventory-item/list-inventory-item.component";
import {NgForOf} from "@angular/common";
import {item,items} from "../../../../dto/item";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../service/inventory.service";

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
              private inventoryService: InventoryService) {
  }

  ngOnInit() {
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
}
