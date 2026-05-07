import {Component} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FormsModule} from "@angular/forms";
import {StatisticsService} from "../../service/statistics.service";
import {
  itemName,
  dateFilterDto,
  itemInventoryComparisonRequestDto,
  ItemInventoryComparisonDto, inactiveInventoriesDto
} from "../../dto/statistics";
import {
  ItemName,
  StatisticsSelectItemsComponent
} from "../../shared/statistics-select-items/statistics-select-items.component";
import {MatDialog} from "@angular/material/dialog";
import {ComparisonGroupingMode} from "../../shared/constants/comparison-grouping-mode";
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration} from 'chart.js';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    NgForOf,
    NgIf,
    BaseChartDirective,
    FormsModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  startDate: string = ''
  endDate: string = ''
  selectedGroupingMode: ComparisonGroupingMode = 'YEAR';
  comparisonResults: ItemInventoryComparisonDto[] = [];
  selectedItemIndex = 0;
  chartScope: 'inventory' | 'timeRange' = 'timeRange';
  inactiveInventoriesNames: inactiveInventoriesDto[] | undefined;
  inventorySearchTerm: string = "";

  chartType: 'bar' = 'bar';
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  constructor(
    private statisticsService: StatisticsService,
    private dialog: MatDialog
  ) {
  }

  /**
   * Sets the current view and triggers the corresponding method.
   */
  setView(view: 'inventory' | 'timeRange'): void {
    this.chartScope = view;

    // Call the appropriate method based on the selected view
    switch (view) {
      case 'inventory':
        this.getInactiveInventories()
        break;
      case 'timeRange':

        break;
    }
  }

  getInactiveInventories() {
    // this.statisticsService.getInactiveInventories().subscribe({
    //   next: (value: inactiveInventoriesDto[]) => {
    //     this.inactiveInventoriesNames = value
    //   }
    // });
  }


  search() {
    this.getItemsForDropdown();
  }

  getItemsForDropdown() {
    let dates: dateFilterDto = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    if (!this.checkDate(this.startDate, this.endDate)) {
      alert("Provjeri datume.")
      return;
    } else {
      this.statisticsService.getItemsForDropdown(dates).subscribe({
        next: (data: itemName[]) => {
          const dialogRef = this.dialog.open(StatisticsSelectItemsComponent, {
            width: '500px',
            data: data
          });

          dialogRef.afterClosed().subscribe((result: ItemName[] | undefined) => {
            if (result) {

              const request: itemInventoryComparisonRequestDto = {
                startDate: this.startDate,
                endDate: this.endDate,
                groupingMode: this.selectedGroupingMode,
                itemNames: result.map(item => item.nameOfItem)
              }
              this.statisticsService.getItemInventoryComparisons(request).subscribe({
                next: value => {
                  this.comparisonResults = value;
                  this.selectedItemIndex = 0;
                  this.updateChart();
                }
              });
            }
          });
        }
      });
    }
  }

  //CHART
  checkDate(startDate: string, endDate: string): boolean {
    return !!startDate && !!endDate && startDate <= endDate;
  }

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Vrijeme'
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        title: {
          display: true,
          text: 'Količina'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  get selectedItem(): ItemInventoryComparisonDto | null {
    return this.comparisonResults.length > 0
      ? this.comparisonResults[this.selectedItemIndex]
      : null;
  }

  updateChart(): void {
    if (!this.selectedItem) {
      this.chartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    const labels = this.selectedItem.comparisons.map(entry => entry.label);
    const expected = this.selectedItem.comparisons.map(entry => entry.expectedAmount);
    const actual = this.selectedItem.comparisons.map(entry => entry.actualAmount);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Expected',
          data: expected,
          backgroundColor: '#1f3b73'
        },
        {
          label: 'Actual',
          data: actual,
          backgroundColor: '#6ea8fe'
        }
      ]
    };
  }

  onSelectedItemChange(indexValue: string): void {
    this.selectedItemIndex = Number(indexValue);
    this.updateChart();
  }
}
