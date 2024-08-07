import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {selectItem} from "../../../../dto/item";
import {HttpClient} from "@angular/common/http";
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
export class ShowCsvContentComponent implements OnInit{
  csvContent: string | null = null;
  items: selectItem[] = [];
  searchTerm = '';

  constructor(private router: Router,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.csvContent = history.state.csvContent || 'No content to display';
    if (this.csvContent && this.csvContent !== 'No content to display') {
      this.parseCSV(this.csvContent);
    }
  }

  parseCSV(csvContent: string) {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 1) {
      this.items = lines.slice(1).map((line, index) => {  // Skip header line
        const data = this.splitCSVLine(line);
        return {
          itemId: +data[0],
          itemName: data[1],
          itemMeasurement: data[2],
          itemPresentAmount: this.parseNumber(data[3]),  // Parse number correctly
          itemBarcode: data[4],
          itemInputtedAmount: this.parseNumber(data[5]),  // Parse number correctly
          itemUserThatPutTheAmountIn: isNaN(+data[6]) ? 0 : +data[6],  // Default to 0 if NaN
          itemInventoryId: +data[7],
          selected: true
        };
      });
    } else {
      console.error("CSV does not contain enough lines for parsing.");
    }
  }

  parseNumber(value: string): number {
    const cleanedValue = value.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedValue);
  }

  splitCSVLine(line: string): string[] {
    const regex = /(?:^|;)(\"(?:[^\"]+|\"\")*\"|[^;]*)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      matches.push(match[1] ? match[1].replace(/^"|"$/g, '').replace(/""/g, '"').trim() : match[2].trim());
    }
    return matches;
  }

  filteredItems(): selectItem[]{
    return this.items.filter((selectedItem) =>
    selectedItem.itemName.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onSubmit() {
    const selectedItems = this.items.filter(item => item.selected);
    //this.saveItems(selectedItems);
  }

  // saveItems(items: selectItem[]) {
  //   this.http.post('/api/save-items', items).subscribe(response => {
  //     console.log('Items saved successfully', response);
  //   }, error => {
  //     console.error('Error saving items', error);
  //   });
  // }
}
