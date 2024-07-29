import {Component, Input} from '@angular/core';
import {inventoriesPiece} from "../../../dto/inventories";
import {DatePipe} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [
    DatePipe,
    RouterOutlet
  ],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css'
})
export class DropdownItemComponent {
  @Input() item!: inventoriesPiece;

  constructor(private router: Router) {
  }

  onItemClick() {
    // Handle the item click event
    console.log('Item clicked:', this.item);
    this.router.navigate(['/controller/inventories']);
  }
}
