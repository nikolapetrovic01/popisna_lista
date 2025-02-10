import {Component, OnInit} from '@angular/core';
import {inventories, inventoriesPiece} from "../../../dto/inventories";
import {Router} from "@angular/router";
import {InventoryService} from "../../../service/inventory.service";
import {DropdownItemComponent} from "../../controller/dropdown-item/dropdown-item.component";
import {HeaderComponent} from "../../header/header.component";
import {NgForOf, NgIf} from "@angular/common";

// noinspection DuplicatedCode
@Component({
  selector: 'app-worker-lower-level',
  standalone: true,
  imports: [
    DropdownItemComponent,
    HeaderComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './worker-lower-level.component.html',
  styleUrl: './worker-lower-level.component.css'
})
export class WorkerLowerLevelComponent implements OnInit {
  isLoadingTasks = true;
  activeItems: inventoriesPiece[] = [];
  filteredActiveItems: inventoriesPiece[] = [];

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {
  }

  ngOnInit(): void {
    this.inventoryService.getWorkerInventory().subscribe(
      {
        next: (data: inventories) => {
          this.activeItems = data.tables
            .filter(item => item.status === 1);

          this.filteredActiveItems = [...this.activeItems];
          this.isLoadingTasks = false;
        },
        error: (error) => console.error(error)
      });
  }

  /**
   * Navigates to the selected inventory's page, passing its status as a query parameter.
   * @param inventoryClicked - The clicked inventory item
   */
  navigateToInventoryClicked(inventoryClicked: any): void {
    let flag = true
    if (inventoryClicked.status === 0){
      flag = false;
    }
    this.router.navigate(['/worker/inventory', inventoryClicked.id],
      { queryParams: { fromActive: flag }});
  }
}
