import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {selectedItems, selectItem} from "../../../../dto/item";
import {Location, DatePipe, NgIf} from "@angular/common";
import {InventoryService} from "../../../../service/inventory.service";
import {DateService} from "../../../../service/date.service";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-new-inventory',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    DatePipe,
  ],
  templateUrl: './create-new-inventory.component.html',
  styleUrl: './create-new-inventory.component.css'
})
export class CreateNewInventoryComponent implements OnInit {
  successMessage: string = "Uspješno učitano";
  defaultMessage: string = "Izaberi fajl ili ga prevuci";
  fileName: string = this.defaultMessage;
  file: File | null = null;
  filteredItems: selectItem[] = [];
  isNavigatingBack = false;
  startDate: string;
  endDate: string;
  errorMessage: string | null = null;

  constructor(private router: Router,
              private inventoryService: InventoryService,
              private dateService: DateService,
              private location: Location,
              private toastr: ToastrService) {
    this.startDate = this.dateService.getStartDate() || new Date().toISOString().substring(0, 10);
    this.endDate = this.dateService.getEndDate() || new Date().toISOString().substring(0, 10);
  }

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
          this.fileName = this.successMessage;
        }
      }
    } else {
      this.filteredItems = [];
    }

    this.startDate = this.dateService.getStartDate() || this.startDate;
    this.endDate = this.dateService.getEndDate() || this.endDate;
  }


  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = this.defaultMessage;

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
      event.preventDefault();
      this.rememberDate();
      this.router.navigateByUrl('controller/create/show-csv', {state: {data: this.filteredItems, file: this.file}});
    }
  }

  onDrop(event: DragEvent) {
    //TODO: FINISH LIKE onFileChange
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.file = event.dataTransfer.files[0];
      this.fileName = this.successMessage;
      this.change();
    } else {
      console.error("Drag event is invalid or no files were dropped.");
    }
  }

  onDragOver(event: DragEvent) {
    //TODO: FINISH LIKE onFileChange
    event.preventDefault();
  }

  change() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        this.isNavigatingBack = false;
        this.rememberDate();
        this.router.navigateByUrl('controller/create/show-csv', {
          state: {
            csvContent,
            data: this.filteredItems,
            file: this.file
          }
        });
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
    this.fileName = this.defaultMessage;
    const fileDropArea = document.querySelector('.file-drop-area');
    if (fileDropArea) {
      fileDropArea.classList.remove('file-selected');
      fileDropArea.classList.remove('disabled');  // Remove the disabled class to revert the style
    }
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.disabled = false;
  }

  validateDate() {
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        this.errorMessage = "Datum početka mora biti prije datuma kraja";
        return false;
      }
    }
    this.errorMessage = null;
    return true;
  }

  rememberDate() {
    this.dateService.setStartDate(new Date(this.startDate));
    this.dateService.setEndDate(new Date(this.endDate));
  }

  /**
   * Sends request to backend to save the items given in CSV
   */
  onSubmit() {
    if (!this.validateDate()) {
      return;
    }

    const selectedItems: selectedItems = {
      selectedItems: this.filteredItems.filter(item => item.selected === true),
      startDate: new Date(this.startDate),
      endDate: new Date(this.endDate)
    };

    this.inventoryService.createNewInventory(selectedItems).subscribe(
      response => {
        this.toastr.success('Inventory created successfully');
        console.log("Inventory created successfully", response);
      },
      error => {
        this.toastr.success("Error creating inventory", error);
        console.error("Error creating inventory", error);
      }
    );
    this.location.back();
  }
}
