import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {DropdownItemComponent} from "./dropdown-item/dropdown-item.component";
import {inventories, inventoriesPiece} from "../../dto/inventories";
import {InventoryService} from "../../service/inventory.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-controller',
  standalone: true,
    imports: [
        RouterOutlet,
        DropdownItemComponent,
        CommonModule,
    ],
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css'
})
export class ControllerComponent implements OnInit {
  isActiveOpen: boolean = false;
  isInactiveOpen: boolean = false;
  activeItems: inventoriesPiece[] = [];
  inactiveItems: inventoriesPiece[] = [];

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
  }

  ngOnInit() {
    this.inventoryService.getInventory().subscribe(
      {
        next: (data: inventories) => {
          this.activeItems = data.tables.filter(item => item.status === 1);
          this.inactiveItems = data.tables.filter(item => item.status === 0);
          //Status 2 needs to be handled
        },
        error: (error) => console.error(error)
      });
  }

  navigateToCreateNewInventory(): void {
    this.router.navigate(['/controller/create'])
  }

  navigateToInventoryClicked(inventoryClicked: any): void {
    let flag = true
    if (inventoryClicked.status === 0){
      flag = false;
    }
    this.router.navigate(['/controller/inventory', inventoryClicked.id],
      { queryParams: { fromActive: flag }});
  }


  toggleDropdown(dropdownType: string): void {
    if (dropdownType === 'active') {
      this.isActiveOpen = !this.isActiveOpen;
      this.isInactiveOpen = false;  // Ensures only one dropdown is open at a time
    } else if (dropdownType === 'inactive') {
      this.isInactiveOpen = !this.isInactiveOpen;
      this.isActiveOpen = false;
    }
  }
}
