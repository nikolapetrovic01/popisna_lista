import {Component, Input} from '@angular/core';
import {User} from "../../../dto/user";

@Component({
  selector: 'app-dropdown-user',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-user.component.html',
  styleUrl: './dropdown-user.component.css'
})
export class DropdownUserComponent {
  @Input() user!: User;
}
