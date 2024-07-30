import {Component, Input} from '@angular/core';
import {item} from "../../../../dto/item";
import {FormsModule} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-inventory-item',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './list-inventory-item.component.html',
  styleUrl: './list-inventory-item.component.css'
})
export class ListInventoryItemComponent {
  @Input() item!: item;
  @Input() isEditable: boolean = false;

  constructor(private inventoryService: InventoryService) {}

  onInputtedAmountChange(item: item): void {
    console.log('New inputted amount:', item.itemInputtedAmount);
    // this.inventoryService.updateItemAmount(item.itemId, item.itemInputtedAmount).subscribe(
    //   response => {
    //     console.log('Update successful', response);
    //   },
    //   error => {
    //     console.error('Error updating amount', error);
    //   }
    // );
  }
}