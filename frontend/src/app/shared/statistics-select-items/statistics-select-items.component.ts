import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";

export interface ItemName {
  nameOfItem: string
}
@Component({
  selector: 'app-statistics-select-items',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './statistics-select-items.component.html',
  styleUrl: './statistics-select-items.component.css'
})
export class StatisticsSelectItemsComponent implements OnInit{
  searchTerm = ''
  selectedItems: ItemName[] = [];

  constructor(
    public dialogRef: MatDialogRef<StatisticsSelectItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemName[]
  ) {}

  ngOnInit() {
    this.checkIfDataEmpty()
  }

  checkIfDataEmpty(): boolean {
    return this.data.length <= 0;
  }

  get filteredItems(): ItemName[] {
    const term = this.searchTerm.trim().toLowerCase()

    if (term.length < 2) {
      return [];
    }

    return this.data
      .filter(item => item.nameOfItem.toLowerCase().includes(term))
      .slice(0 ,50)
  }

  isSelected(item: ItemName): boolean {
    return this.selectedItems.some(selected => selected.nameOfItem === item.nameOfItem)
  }

  toggleItem(item: ItemName): void {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selected => selected.nameOfItem !== item.nameOfItem);
    } else {
      this.selectedItems = [...this.selectedItems, item];
    }
  }

  removeSelected(item: ItemName): void {
    this.selectedItems = this.selectedItems.filter(selected => selected.nameOfItem !== item.nameOfItem);
  }

  onCancel(): void {
    // Closes the dialog without passing any data (acts like a 'Cancel')
    this.dialogRef.close();
  }

  onSave(): void {
    // Closes the dialog and passes the edited user object back to the caller
    this.dialogRef.close(this.selectedItems);
  }
}
