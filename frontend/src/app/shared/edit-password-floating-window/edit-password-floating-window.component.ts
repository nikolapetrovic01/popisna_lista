import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";

export interface PasswordEditData {
  id: number,
  name: string,
  password: string
}
@Component({
  selector: 'app-edit-password-floating-window',
  standalone: true,
  imports: [
    MatDialogContent,
    FormsModule,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './edit-password-floating-window.component.html',
  styleUrl: './edit-password-floating-window.component.css'
})
export class EditPasswordFloatingWindowComponent {
  editableEntity: PasswordEditData;

  loginForm = new FormGroup({
    id: new FormControl<number>(-1, { nonNullable: true, validators:[Validators.required]}),
    name: new FormControl<string>('', { nonNullable: true, validators:[Validators.required]}),
    password: new FormControl<string>('', { nonNullable: true, validators:[Validators.required]}),
  });

  constructor(
    public dialogRef: MatDialogRef<EditPasswordFloatingWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PasswordEditData
  ) {
    this.editableEntity = { ...data}
  }

  onCancel(): void {
    // Closes the dialog without passing any data (acts like a 'Cancel')
    this.dialogRef.close();
  }

  onSave(): void {
    // Closes the dialog and passes the edited user object back to the caller
    if (!this.editableEntity.password || this.editableEntity.password.length < 8) {
      return;
    }

    this.dialogRef.close(this.editableEntity);
  }

}
