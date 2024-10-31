import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {selectItem} from "../../../../dto/item";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {StorageService} from "../../../../service/storageService";

@Component({
  selector: 'app-show-csv-content',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './show-csv-content.component.html',
  styleUrl: './show-csv-content.component.css'
})
export class ShowCsvContentComponent implements OnInit {
  csvContent: string | null = null;
  items: selectItem[] = [];
  searchTerm = '';

  constructor(private router: Router,
              private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.csvContent = this.storageService.getItem<string>('csvContent');
    this.items = this.storageService.getItem<selectItem[]>('filteredItems') || [];

    if (this.csvContent && this.csvContent !== 'No content to display'){
      this.parseCSV(this.csvContent);
    } else if (this.items.length > 0) {
      console.log("Items loaded from localStorage.");
    } else {
      console.error("No content to display");
    }
  }

  parseCSV(csvContent: string) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 1) {
      const existingItems = this.items; // Items already loaded from localStorage

      this.items = lines.slice(1).map(line => {
        const data = this.splitCSVLine(line);
        const itemId = +data[0].replace(/\s/g, '');

        // Check if the item already exists in localStorage (existingItems)
        const existingItem = existingItems.find(item => item.itemId === itemId);

        return {
          itemId: itemId,
          itemName: data[1],
          itemMeasurement: data[2],
          itemPresentAmount: this.parseNumber(data[3]),
          itemBarcode: data[4],
          itemInputtedAmount: this.parseNumber(data[5]),
          itemUserThatPutTheAmountIn: isNaN(+data[6]) ? 0 : +data[6],
          itemInventoryId: +data[7] || 0,
          selected: existingItem ? existingItem.selected : true // Use existing selected status if available
        };
      });

      this.storageService.setItem('filteredItems', this.items);
    } else {
      console.error("CSV does not contain enough lines for parsing.");
    }
  }


  parseNumber(value: string): number {
    if (!value || value.trim() === '') {
      return 0;  // Return a default value if the input is invalid
    }
    const cleanedValue = value.replace(/\s/g, '').replace(',', '.');
    const parsedNumber = parseFloat(cleanedValue);
    return isNaN(parsedNumber) ? 0 : parsedNumber;
  }

  splitCSVLine(line: string): string[] {
    // Update this to handle semicolons instead of whitespace
    return line.split(';');
  }

  filteredItems(): selectItem[] {
    return this.items.filter((selectedItem) =>
      selectedItem.itemName.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  /**
   * This method updates the localStorage with the current state of items.
   * It should be called after any change to the items' selection state.
   */
  public updateLocalStorage() {
    this.storageService.setItem('filteredItems', this.items);
  }

  onSubmit() {
    this.storageService.setItem('filteredItems', this.items);
    this.router.navigateByUrl('/controller/create');
    // this.router.navigateByUrl('/controller/create', {state: {data: this.items, file: history.state.file}});
  }
}
