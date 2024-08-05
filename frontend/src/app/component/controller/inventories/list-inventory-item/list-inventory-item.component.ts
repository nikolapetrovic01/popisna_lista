import {Component, Input} from '@angular/core';
import {item} from "../../../../dto/item";
import {FormsModule} from "@angular/forms";
import {InventoryService} from "../../../../service/inventory.service";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

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
  // @Input() parentItemId!: number;
  @Input() parentItemId: number | null = null;
  @Input() isEditable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {}

  onInputtedAmountChange(itemSelected: item): void {
    const inventoryId = this.parentItemId ?? 0;
    this.inventoryService.updateItemAmount(itemSelected.itemId, itemSelected.itemInputtedAmount, inventoryId).subscribe(
      response => {
        console.log('Update successful', response);
      },
      error => {
        console.error('Error updating amount', error);
      }
    );
  }

  validateNumber(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode !== 46 && charCode !== 45 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}
