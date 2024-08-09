import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {selectItem} from "../../../../dto/item";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-create-new-inventory',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './create-new-inventory.component.html',
  styleUrl: './create-new-inventory.component.css'
})
export class CreateNewInventoryComponent implements OnInit{
  file: File | null = null;
  fileName: string = 'Izaberi fajl ili ga prevuci'
  filteredItems: selectItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (history.state.data) {
      const fileDropArea = document.querySelector('.file-drop-area');
      if (fileDropArea) {
        fileDropArea.classList.add('disabled');
      }
      this.filteredItems = history.state.data;
      if (history.state.file) {
        this.file = history.state.file;
        if (this.file) {
          this.fileName = this.file.name;
        }
      }
      console.log(this.filteredItems);
    } else {
      this.filteredItems = [];
    }
  }

  onFileChange(event: any) {
    // if (this.filteredItems.length > 0) {
    //   // Redirect to the next page if filteredItems already has data
    //   this.router.navigateByUrl('controller/create/show-csv', { state: { data: this.filteredItems, file: this.file } });
    //   return;
    // }
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = event.target.files[0].name;

      const fileDropArea = document.querySelector('.file-drop-area');
      if (fileDropArea) {
        fileDropArea.classList.add('disabled');
      }
      input.disabled = true;
      this.change();
    } else {
      console.error("File input is invalid or no files were selected.");
    }
  }

  preventFileSelection(event: MouseEvent) {
    if (this.filteredItems.length > 0) {
      event.preventDefault(); // Prevent the file explorer from opening
      this.router.navigateByUrl('controller/create/show-csv', { state: { data: this.filteredItems, file: this.file } });
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.file = event.dataTransfer.files[0];
      this.fileName = event.dataTransfer.files[0].name;
      this.change();
    } else {
      console.error("Drag event is invalid or no files were dropped.");
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  change() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        this.router.navigateByUrl('controller/create/show-csv', { state: { csvContent, data: this.filteredItems, file: this.file } });
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsText(this.file);
    } else {
      console.error("No file has been selected or dropped.");
    }
  }

  removeFile() {
    this.file = null;
    this.filteredItems = [];
    this.fileName = 'Izaberi fajl ili ga prevuci';
    const fileDropArea = document.querySelector('.file-drop-area');
    if (fileDropArea) {
      fileDropArea.classList.remove('file-selected');
      fileDropArea.classList.remove('disabled');  // Remove the disabled class to revert the style
    }
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.disabled = false;
  }

  onSubmit() {
    console.log("Submit pressed");
    // Implement your logic to send data to the backend
  }
}
