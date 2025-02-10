import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {item, items} from "../../../../../dto/item";
import {InventoryService} from "../../../../../service/inventory.service";
import {
  ListInventoryItemComponent
} from "../../../../controller/inventories/list-inventory-item/list-inventory-item.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-worker-inventory-view',
  standalone: true,
  imports: [
    ListInventoryItemComponent,
    NgForOf
  ],
  templateUrl: './worker-inventory-view.component.html',
  styleUrl: './worker-inventory-view.component.css'
})
export class WorkerInventoryViewComponent implements OnInit {
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
