import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {DropdownItemComponent} from "../../controller/dropdown-item/dropdown-item.component";
import {Router} from "@angular/router";
import {InventoryService} from "../../../service/inventory.service";
import {inventories, inventoriesPiece} from "../../../dto/inventories";
import {HeaderComponent} from "../../header/header.component";

@Component({
  selector: 'app-worker-higher-level',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DropdownItemComponent,
    HeaderComponent
  ],
  templateUrl: './worker-higher-level.component.html',
  styleUrl: './worker-higher-level.component.scss'
})
export class WorkerHigherLevelComponent implements OnInit{
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
