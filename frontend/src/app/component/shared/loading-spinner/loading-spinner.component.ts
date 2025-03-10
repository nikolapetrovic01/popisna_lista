import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  @Input() size: string = '50px';
}
