import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {selectItem} from "../../../../dto/item";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

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

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if (history.state.csvContent) {
      this.csvContent = history.state.csvContent;
      if (this.csvContent && this.csvContent !== 'No content to display') {
        this.parseCSV(this.csvContent);
      }
    } else if (history.state.data) {
      this.items = history.state.data;
    } else {
      console.error("No content to display");
    }
  }

  parseCSV(csvContent: string) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 1) {

      // Parse each line after the header (assuming the first line is the header)
      this.items = lines.slice(1).map((line, index) => {
        const data = this.splitCSVLine(line);

        return {
          itemId: +data[0].replace(/\s/g, ''),  // Remove spaces and parse as number
          itemName: data[1],
          itemMeasurement: data[2],
          itemPresentAmount: this.parseNumber(data[3]),  // Parse number correctly
          itemBarcode: data[4],
          itemInputtedAmount: this.parseNumber(data[5]),  // Parse number correctly
          itemUserThatPutTheAmountIn: isNaN(+data[6]) ? 0 : +data[6],  // Default to 0 if NaN
          itemInventoryId: +data[7] || 0,  // Parse and default to 0 if missing
          selected: true
        };
      });
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

  onSubmit() {
    this.router.navigateByUrl('/controller/create', {state: {data: this.items, file: history.state.file}});
  }
}
