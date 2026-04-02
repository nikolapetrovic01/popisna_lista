import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DropdownItemComponent} from "./dropdown-item/dropdown-item.component";
import {
  inventories,
  inventoriesPiece,
  inventoryProgressChartRequestDto,
  inventoryProgressChartResponseDto
} from "../../dto/inventories";
import {InventoryService} from "../../service/inventory.service";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";
import {NgIf, NgForOf} from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration} from 'chart.js';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [
    DropdownItemComponent,
    CommonModule,
    HeaderComponent,
    FormsModule,
    BaseChartDirective,
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
  inventoryState: inventoryProgressChartResponseDto | null = null

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

          //Calling statistics chart
          if (this.activeItems.length > 0) {
            this.loadInventoryStatusChart(this.activeItems[0].id);
          }

          //Status 2 needs to be handled
        },
        error: (error) => console.error(error)
      }
    );
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

    this.router.navigate(['/controller/inventory', inventoryClicked.id],
      {queryParams: {fromActive: flag}});
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

  //CHART
  pieChartType: 'pie' = 'pie';

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Netaknuti', 'Započeti'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#94a3b8', '#8FC74A'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#ffffff',
          boxWidth: 14,
          padding: 14
        }
      }
    }
  };
  loadInventoryStatusChart(inventoryId: number): void {
    const request: inventoryProgressChartRequestDto = {
      inventoryId: inventoryId
    };

    this.inventoryService.getInventoryStatus(request).subscribe({
      next: (value: inventoryProgressChartResponseDto) => {
        this.inventoryState = value;
        this.updatePieChart();
      },
      error: (error) => console.error(error)
    });
  }

  updatePieChart(): void {
    if (!this.inventoryState) {
      this.pieChartData = {
        labels: ['Netaknuti', 'Započeti'],
        datasets: [
          {
            data: [0, 0],
            backgroundColor: ['#94a3b8', '#8FC74A'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 2
          }
        ]
      };
      return;
    }

    this.pieChartData = {
      labels: ['Netaknuti', 'Započeti'],
      datasets: [
        {
          data: [
            this.inventoryState.untouchedCount,
            this.inventoryState.startedCount
          ],
          backgroundColor: ['#94a3b8', '#8FC74A'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 2
        }
      ]
    };
  }
}
