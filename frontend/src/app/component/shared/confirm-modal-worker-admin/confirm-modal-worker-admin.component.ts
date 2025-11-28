import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-modal-worker-admin',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal-worker-admin.component.html',
  styleUrl: './confirm-modal-worker-admin.component.css'
})
export class ConfirmModalWorkerAdminComponent {
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<boolean>();

  closeModal(answer: boolean) {
    this.confirm.emit(answer);
  }
}
