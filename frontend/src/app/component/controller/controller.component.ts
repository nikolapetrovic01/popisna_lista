import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {DropdownItemComponent} from "./dropdown-item/dropdown-item.component";
import {inventories, inventoriesPiece} from "../../dto/inventories";
import {InventoryService} from "../../service/inventory.service";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    DropdownItemComponent,
    CommonModule,
    HeaderComponent,
    FormsModule,
  ],
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css'
})
export class ControllerComponent implements OnInit {
  isActiveOpen: boolean = false;
  isInactiveOpen: boolean = false;
  activeItems: inventoriesPiece[] = [];
  inactiveItems: inventoriesPiece[] = [];
  filteredActiveItems: inventoriesPiece[] = [];

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
  }

  /**
   * Fetches inventory data and filters it into active and inactive items.
   * Called when the component initializes.
   */
  ngOnInit() {
    this.inventoryService.getInventory().subscribe(
      {
        next: (data: inventories) => {
          let allActive = data.tables.filter(item => item.status === 1);
          let allInactive = data.tables.filter(item => item.status === 0);

          // 2. Sort the filtered arrays in DESCENDING order (newest first)
          // The sort function compares timestamps: b - a results in descending order.
          const sortByStartDateDescending = (a: inventoriesPiece, b: inventoriesPiece) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            // For descending order (newest first): compare B to A
            return dateB - dateA;
          };

          this.activeItems = allActive.sort(sortByStartDateDescending);
          this.inactiveItems = allInactive.sort(sortByStartDateDescending);

          this.filteredActiveItems = [...this.activeItems];
          //Status 2 needs to be handled
        },
        error: (error) => console.error(error)
      });
  }

  /**
   * Navigates to the "Create New Inventory" page.
   */
  navigateToCreateNewInventory(): void {
    this.router.navigate(['/controller/create'])
  }

  /**
   * Navigates to the selected inventory's page, passing its status as a query parameter.
   * @param inventoryClicked - The clicked inventory item
   */
  navigateToInventoryClicked(inventoryClicked: any): void {
    let flag = inventoryClicked.status !== 0;
    // let flag = true
    // if (inventoryClicked.status === 0) {
    //   flag = false;
    // }

    this.router.navigate(['/controller/inventory', inventoryClicked.id],
      { queryParams: { fromActive: flag }});
  }

  /**
   * Toggles the visibility of the active or inactive dropdown list.
   * Ensures that only one dropdown can be open at a time.
   * @param dropdownType - Specifies which dropdown to toggle ('active' or 'inactive')
   */
  toggleDropdown(dropdownType: string): void {
    if (dropdownType === 'active') {
      this.isActiveOpen = !this.isActiveOpen;
      this.isInactiveOpen = false;  // Ensures only one dropdown is open at a time
    } else if (dropdownType === 'inactive') {
      this.isInactiveOpen = !this.isInactiveOpen;
      this.isActiveOpen = false;
    }
  }

  filterItems(): void {
    const startDateInput = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDateInput = (document.getElementById('endDate') as HTMLInputElement).value;
    const startDate = startDateInput ? new Date(startDateInput) : null;
    const endDate = endDateInput ? new Date(endDateInput) : null;

    this.filteredActiveItems = this.activeItems.filter(item => {
      const itemStartDate = new Date(item.startDate);
      return (!startDate || itemStartDate >= startDate) && (!endDate || itemStartDate <= endDate);
    });
  }
}
