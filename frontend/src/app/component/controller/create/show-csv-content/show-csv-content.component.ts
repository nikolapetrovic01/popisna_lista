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
  nameSearchTerm = '';
  barcodeSearchTerm: string = '';
  dropdownItems: string[] = ['Ponisti' ,'Selektovano', 'Neselektovano'];
  selectedItem: string | null = null;

  constructor(private router: Router,
              private storageService: StorageService) {
  }

  /**
   * Loads data from localStorage when the component initializes.
   */
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

  /**
   * Parses the CSV content string and maps it to an array of selectItem objects.
   * @param csvContent - The content of the CSV file as a string
   */
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
          itemInputtedAmount: -1,
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

  /**
   * Parses a string value into a number, handling common cases for empty and invalid input.
   * @param value - The string to parse as a number
   * @returns - The parsed number, or 0 if parsing fails
   */
  parseNumber(value: string): number {
    if (!value || value.trim() === '') {
      return 0;  // Return a default value if the input is invalid
    }
    const cleanedValue = value.replace(/\s/g, '').replace(',', '.');
    const parsedNumber = parseFloat(cleanedValue);
    return isNaN(parsedNumber) ? 0 : parsedNumber;
  }

  /**
   * Splits a CSV line into individual data fields based on semicolon separators.
   * @param line - The CSV line to split
   * @returns - An array of string values representing each field in the line
   */
  splitCSVLine(line: string): string[] {
    // Update this to handle semicolons instead of whitespace
    return line.split(';');
  }

  /**
   * Filters the items array based on the search term.
   * @returns - An array of items whose names match the search term
   */
  filteredItems(): selectItem[] {
   if (!this.nameSearchTerm && !this.barcodeSearchTerm && !this.selectedItem) {
      return this.items; // Reset to all items when all filters are cleared
    }

    return this.items.filter((item) => {
      // Name filtering
      const nameMatches = this.nameSearchTerm.trim() === '' ||
        item.itemName.toLowerCase().includes(this.nameSearchTerm.toLowerCase());

      // Barcode filtering - Ensures clearing search resets list
      const barcodeMatches = typeof this.barcodeSearchTerm === 'string' && this.barcodeSearchTerm.trim() === '' ||
        (!isNaN(Number(this.barcodeSearchTerm)) && item.itemBarcode.includes(this.barcodeSearchTerm));

      // Dropdown filtering (Selected, Not Selected, or All)
      const selectionMatches = this.selectedItem === "Neselektovano" ? !item.selected :
        this.selectedItem === "Selektovano" ? item.selected : true;

      return nameMatches && barcodeMatches && selectionMatches;
    });
  }

  /**
   * Updates localStorage with the current state of items.
   * Should be called after any change to the items' selection state.
   */
  public updateLocalStorage() {
    this.storageService.setItem('filteredItems', this.items);
  }

  /**
   * Saves the current items to localStorage and navigates back to the inventory creation page.
   */
  onSubmit() {
    this.storageService.setItem('filteredItems', this.items);
    this.router.navigate(['/controller/create']);
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }
}
