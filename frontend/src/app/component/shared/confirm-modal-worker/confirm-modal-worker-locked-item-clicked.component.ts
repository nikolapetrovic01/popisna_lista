import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal-worker-locked-item-clicked.component.html',
  styleUrl: './confirm-modal-worker-locked-item-clicked.component.css'
})
export class ConfirmModalWorkerLockedItemClickedComponent {
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<boolean>();

  closeModal(answer: boolean) {
    this.confirm.emit(answer);
  }
}
