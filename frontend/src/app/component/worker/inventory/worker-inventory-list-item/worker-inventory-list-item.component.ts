import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {item, updateItemAmount} from "../../../../dto/item";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-worker-inventory-list-item',
  standalone: true,
    imports: [
        FormsModule,
        NgIf
    ],
  templateUrl: './worker-inventory-list-item.component.html',
  styleUrl: './worker-inventory-list-item.component.css'
})
export class WorkerInventoryListItemComponent {
  @Input() item!: item;
  @Input() isEditable: boolean = true;
  updatedItem!: updateItemAmount | null;
  @Output() itemChanged = new EventEmitter<updateItemAmount>();
  @Output() lockedItemClick = new EventEmitter<item>();
  @Output() inputClicked = new EventEmitter<any>();


  onInputClick(): void {
    // This emits the event and passes the item object up to the parent.
    this.inputClicked.emit(this.item);
  }

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

  /**
   * If the input is locked, trigger a modal event.
   */
  handleLockedItemClick(item: item) {
    if (!this.isEditable) {
      this.lockedItemClick.emit(item);
    }
  }
}
