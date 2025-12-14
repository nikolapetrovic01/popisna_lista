import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {user} from "../../dto/user";
import {NgForOf} from "@angular/common";

export interface UserEditData {
  id: number,
  name: string,
  level: number
}
@Component({
  selector: 'app-edit-floating-window',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatDialogActions,
    MatButton,
    NgForOf
  ],
  templateUrl: './edit-floating-window.component.html',
  styleUrl: './edit-floating-window.component.css'
})
export class EditFloatingWindowComponent {
  // We make a copy of the user data so we don't modify the original until confirmed
  editableUser: user;

  // Available levels for the dropdown
  availableLevels: number[] = [1, 2, 3];

  constructor(
    public dialogRef: MatDialogRef<EditFloatingWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserEditData
  ) {
    this.editableUser = { ...data}
  }

  onCancel(): void {
    // Closes the dialog without passing any data (acts like a 'Cancel')
    this.dialogRef.close();
  }

  onSave(): void {
    // Closes the dialog and passes the edited user object back to the caller
    this.dialogRef.close(this.editableUser);
  }
}
