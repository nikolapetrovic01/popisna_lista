import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-new-inventory',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-new-inventory.component.html',
  styleUrl: './create-new-inventory.component.css'
})
export class CreateNewInventoryComponent {
  file: File | null = null;
  fileName: string = 'Izaberi fajl ili ga prevuci'

  constructor(private router: Router) {
  }

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = event.target.files[0].name;
      const fileDropArea = document.querySelector('.file-drop-area');
      if (fileDropArea) {
        fileDropArea.classList.add('file-selected');
      }
      console.log('File selected:', this.file.name);
      this.change();
    } else {
      console.error("File input is invalid or no files were selected.");
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.file = event.dataTransfer.files[0];
      this.fileName = event.dataTransfer.files[0].name;
      console.log('File dropped:', this.file.name);
      this.change();
    } else {
      console.error("Drag event is invalid or no files were dropped.");
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.change();
  }

  change() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        this.router.navigateByUrl('controller/create/show-csv', { state: { csvContent } });
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsText(this.file);
    } else {
      console.error("No file has been selected or dropped.");
    }
  }
  onSubmit(){
    console.log("Submit pressed");
  }
}
