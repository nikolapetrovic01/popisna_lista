import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {selectedItems, selectItem} from "../../../../dto/item";
import {Location, DatePipe, NgIf} from "@angular/common";
import {InventoryService} from "../../../../service/inventory.service";
import {DateService} from "../../../../service/date.service";
import { ToastrService } from 'ngx-toastr';
import {MESSAGES} from "../../../../shared/constants/messages";
import {StorageService} from "../../../../service/storageService";
import {HeaderComponent} from "../../../header/header.component";


@Component({
  selector: 'app-create-new-inventory',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    DatePipe,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './create-new-inventory.component.html',
  styleUrl: './create-new-inventory.component.css'
})
export class CreateNewInventoryComponent implements OnInit {
  fileName: string = MESSAGES.FILE_UPLOAD_PROMPT;
  file: File | null = null;
  filteredItems: selectItem[] = [];
  startDate: string;
  endDate: string;
  errorMessage: string | null = null;
  showX: boolean = false;

  constructor(private router: Router,
              private inventoryService: InventoryService,
              private dateService: DateService,
              private location: Location,
              private toastr: ToastrService,
              private storageService: StorageService) {
    this.startDate = this.dateService.getStartDate() || new Date().toISOString().substring(0, 10);
    this.endDate = this.dateService.getEndDate() || new Date().toISOString().substring(0, 10);
  }

  /**
   * Loads previously stored CSV content and file name from localStorage on component initialization
   */
  ngOnInit() {
    const CSVContent = this.storageService.getItem<string>('csvContent');
    const storedItems = this.storageService.getItem<selectItem[]>('filteredItems');
    const storedFileName  = this.storageService.getItem<string>('fileName');

    if (storedItems && CSVContent){
      this.filteredItems = storedItems;
      this.fileName = storedFileName || MESSAGES.FILE_UPLOAD_PROMPT;

      const fileDropArea = document.querySelector('.file-drop-area');
      if (fileDropArea) {
        fileDropArea.classList.add('disabled');
      }
      this.showX = true;

    } else {
      this.filteredItems = [];
    }

    this.startDate = this.dateService.getStartDate() || new Date().toISOString().substring(0, 10);
    this.endDate = this.dateService.getEndDate() || new Date().toISOString().substring(0, 10);
  }

  /**
   * Triggered when a file is selected, processes the uploaded file
   * @param event - File selection event
   */
  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = this.file.name;

      const fileDropArea = document.querySelector('.file-drop-area');

      if (fileDropArea) {
        fileDropArea.classList.add('disabled');
      }
      input.disabled = true;
      this.change();
    } else {
      this.toastr.error(MESSAGES.FILE_INPUT_INVALID);
    }
  }

  /**
   * Prevents file selection if a file is already loaded and navigates to show CSV content if conditions are met
   * @param event - Click event
   */
  preventFileSelection(event: MouseEvent) {
    if (this.filteredItems.length > 0) {
      event.preventDefault();
      this.rememberDate();
      // this.router.navigateByUrl('controller/create/show-csv');
      this.router.navigate(['controller/create/show-csv']);
    }
  }

  /**
   * Handles file drop event, processes the dropped file similar to onFileChange
   * @param event - File drop event
   */
  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer?.files.length) {
      this.file = event.dataTransfer.files[0];
      this.fileName = this.file.name;

      const fileDropArea = document.querySelector('.file-drop-area');
      if (fileDropArea) {
        fileDropArea.classList.add('disabled');
      }

      this.showX = true;
      this.change();
    } else {
      this.toastr.error(MESSAGES.DRAG_EVENT_INVALID);
    }
  }

  /**
   * Prevents default behavior during drag over the file drop area
   * @param event - Drag over event
   */
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  /**
   * Processes the file, reads content as text, and stores in localStorage
   */
  change() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;

        this.storageService.setItem('csvContent', csvContent);
        this.storageService.setItem('filteredItems', this.filteredItems);
        this.storageService.setItem('fileName', this.fileName);
        // this.router.navigateByUrl('controller/create/show-csv');
        this.router.navigate(['controller/create/show-csv']);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsText(this.file);
    } else {
      this.toastr.error(MESSAGES.DRAG_EVENT_INVALID);
    }
  }

  /**
   * Clears the uploaded file and resets file-related data
   */
  removeFile() {
    // Clear the file and reset file-related data
    this.file = null;
    this.filteredItems = [];  // Clear filteredItems to reset the state
    this.showX = false;
    this.fileName = MESSAGES.FILE_UPLOAD_PROMPT;

    // Remove stored data from localStorage
    this.storageService.removeItem('csvContent');
    this.storageService.removeItem('filteredItems');
    this.storageService.removeItem('fileName');

    // Enable file selection UI
    const fileDropArea = document.querySelector('.file-drop-area');
    if (fileDropArea) {
      fileDropArea.classList.remove('file-selected');
      fileDropArea.classList.remove('disabled'); // Re-enable drop area
    }

    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) fileInput.disabled = false; // Re-enable file input
  }

  /**
   * Validates that start date is before end date
   */
  validateDate() {
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        this.toastr.error(this.errorMessage = MESSAGES.DATE_ERROR);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Stores start and end dates in localStorage
   */
  rememberDate() {
    if (this.startDate) {
      this.dateService.setStartDate(new Date(this.startDate));
    }
    if (this.endDate) {
      this.dateService.setEndDate(new Date(this.endDate));
    }
  }

  onDateChange() {
    this.rememberDate();
  }

  /**
   * Sends the filtered items and dates to the backend service for inventory creation
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
    //   response => {
    //     this.toastr.success(MESSAGES.INVENTORY_SUCCESS_MESSAGE);
    //
    //     // Clear dates, CSV content, and file data
    //     this.startDate = '';
    //     this.endDate = '';
    //     this.removeFile(); // Reuse the method to clear file-related data
    //     this.storageService.removeItem('dateStartKey');
    //     this.storageService.removeItem('dateEndKey');
    //
    //     // this.location.back();
    //     this.router.navigateByUrl('/controller');
    //   },
    //   error => {
    //     this.toastr.success(MESSAGES.INVENTORY_ERROR_MESSAGE);
    //   }
    // );
      {
        next: response => {
          this.toastr.success(MESSAGES.INVENTORY_SUCCESS_MESSAGE);

          // Clear dates, CSV content, and file data
          this.startDate = '';
          this.endDate = '';
          this.removeFile(); // Reuse the method to clear file-related data
          this.storageService.removeItem('dateStartKey');
          this.storageService.removeItem('dateEndKey');

          // this.location.back();
          this.router.navigate(['/controller']);
        },
        error: error => {
          this.toastr.error(MESSAGES.INVENTORY_ERROR_MESSAGE);
        }
      });
  }
}
