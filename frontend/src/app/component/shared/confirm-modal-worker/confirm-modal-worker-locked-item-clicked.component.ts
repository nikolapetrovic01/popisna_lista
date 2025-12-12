import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-modal-worker-locked-item-clicked.component.html',
  styleUrl: './confirm-modal-worker-locked-item-clicked.component.css'
})
export class ConfirmModalWorkerLockedItemClickedComponent {
  @Input() message: string = '';
  @Input() allowNegation: boolean = false;
  @Input() confirmationMessage: string = ''
  @Input() negationMessage: string = ''
  @Output() confirm = new EventEmitter<boolean>();

  closeModal(answer: boolean) {
    this.confirm.emit(answer);
  }
}
