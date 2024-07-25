import {Component, Input} from '@angular/core';
import {inventoriesPiece} from "../../../../dto/inventories";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css'
})
export class DropdownItemComponent {
  @Input() item!: inventoriesPiece;
}
