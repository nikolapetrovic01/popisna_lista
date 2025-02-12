import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() message: string = 'Da li si siguran da želiš promjeniti ovu stavku?';
  @Output() confirm = new EventEmitter<boolean>();

  closeModal(answer: boolean) {
    this.confirm.emit(answer);
  }
}
