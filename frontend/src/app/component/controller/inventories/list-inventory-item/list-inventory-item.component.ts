import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {item, updateItemAmount} from "../../../../dto/item";
import {FormsModule} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-inventory-item',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './list-inventory-item.component.html',
  styleUrl: './list-inventory-item.component.css'
})
export class ListInventoryItemComponent {
  @Input() item!: item;
  @Input() isEditable: boolean = true;
  updatedItem!: updateItemAmount | null;
  @Output() itemChanged = new EventEmitter<updateItemAmount>();

  /**
   * Called when the item input amount is changed. Constructs an update object
   * and sends it to the InventoryService for updating the backend.
   * @param itemSelected - The item whose amount has changed
   */
  onInputtedAmountChange(itemSelected: item): void {
    if (itemSelected.itemInputtedAmount != null) {
      this.updatedItem = {
        itemId: itemSelected.itemId,
        itemName: itemSelected.itemName,
        itemMeasurement: itemSelected.itemMeasurement,
        itemPresentAmount: itemSelected.itemPresentAmount,
        itemBarcode: itemSelected.itemBarcode,
        itemInputtedAmount: itemSelected.itemInputtedAmount,
        itemUserThatPutTheAmountIn: itemSelected.itemInputtedAmount,
        itemInventoryId: itemSelected.itemInventoryId
      };
      this.itemChanged.emit(this.updatedItem);
    }
  }

  //TODO: IMPLEMENT
  /**
   * Validates that only numbers, decimal points, and hyphens are allowed
   * in the input field for the item amount.
   */
  validateNumber( event: Event): void {
    // const charCode = itemSelected.itemInputtedAmount;
    // if (charCode !== 46 && charCode !== 45 && (charCode < 48 || charCode > 57)) {
    //   event.preventDefault();
    // }
    const element = event.target as HTMLInputElement;
    const newValue = element.value;

  }

  protected readonly input = input;
}
