import {Component, OnInit} from '@angular/core';
import {DropdownItemComponent} from "../dropdown-item/dropdown-item.component";
import {inventories, inventoriesPiece} from "../../../dto/inventories";
import {InventoryService} from "../../../service/inventory.service";
import {item, items} from "../../../dto/item";
import {ListInventoryItemComponent} from "./list-inventory-item/list-inventory-item.component";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [
    DropdownItemComponent,
    ListInventoryItemComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent implements OnInit{
  items: item[] = [];
  itemId: number | null = null;
  isEditable: boolean = false;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const fromActive = this.route.snapshot.queryParamMap.get('fromActive');

    if (id !== null) {
      this.itemId = +id;
      this.isEditable = fromActive === 'true';
      this.inventoryService.getItems(this.itemId).subscribe(
        (data: items) => {
          this.items = data.items;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  filteredItems(): item[] {
    return this.items.filter((item) =>
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  closeOpenedInventory(): void {
    console.log('Close Inventory');
    //TODO:Closes the inventory
  }
}
