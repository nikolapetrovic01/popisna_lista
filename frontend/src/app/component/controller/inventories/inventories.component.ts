import {Component, OnInit} from '@angular/core';
import {DropdownItemComponent} from "./dropdown-item/dropdown-item.component";
import {inventories, inventoriesPiece} from "../../../dto/inventories";
import {InventoryService} from "../../../service/inventory.service";

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [
    DropdownItemComponent
  ],
  templateUrl: './inventories.component.html',
  styleUrl: './inventories.component.css'
})
export class InventoriesComponent {
  isActiveOpen: boolean = false;
  isInactiveOpen: boolean = false;
  activeItems: inventoriesPiece[] = [];
  inactiveItems: inventoriesPiece[] = [];

  constructor(
    private inventoryService: InventoryService
  ) {
  }

  // ngOnInit() {
  //   this.inventoryService.getInventory().subscribe(
  //     {
  //       next: (data: inventories) => {
  //         this.activeItems = data.tables.filter(item => item.status === 1);
  //         this.inactiveItems = data.tables.filter(item => item.status === 0);
  //         //Status 2 needs to be handled
  //       },
  //       error: (error) => console.error(error)
  //     });
  // }
}
