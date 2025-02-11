import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {item, updateItemAmount} from "../../../../dto/item";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {InventoryService} from "../../../../service/inventory.service";

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
  @Input() isEditable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService
  ) {}
}
