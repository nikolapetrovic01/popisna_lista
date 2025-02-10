import {Component, OnInit} from '@angular/core';
import {DropdownItemComponent} from "../dropdown-item/dropdown-item.component";
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
export class InventoriesComponent implements OnInit {
  items: item[] = [];
  itemId: number | null = null;
  isEditable: boolean = false;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {
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
      next: (data: items) =>
      {
        this.items = data.items;
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
    return this.items.filter((item) =>
      item.itemName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Closes the opened inventory.
   * TODO: Implement functionality to close the inventory.
   */
  closeOpenedInventory(): void {
    console.log('Close Inventory');
  }
}
