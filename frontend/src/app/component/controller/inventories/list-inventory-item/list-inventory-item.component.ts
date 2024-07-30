import {Component, Input} from '@angular/core';
import {item} from "../../../../dto/item";

@Component({
  selector: 'app-inventory-item',
  standalone: true,
  imports: [],
  templateUrl: './list-inventory-item.component.html',
  styleUrl: './list-inventory-item.component.css'
})
export class ListInventoryItemComponent {
  @Input() item!: item;
}
