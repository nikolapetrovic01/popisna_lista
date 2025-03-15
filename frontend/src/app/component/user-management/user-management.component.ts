import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../service/user.service";
import {CreateUser, User} from "../../dto/user";
import {DropdownUserComponent} from "./dropdown-user/dropdown-user.component";
import {LoadingSpinnerComponent} from "../shared/loading-spinner/loading-spinner.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    DropdownUserComponent,
    NgForOf,
    LoadingSpinnerComponent,
    FormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{
  currentView: 'allUsers' | 'newUser' = 'newUser';
  title: string = 'svi korisnici';
  allUsers: User[] = [];
  selectedUser: User | null = null;
  loading: boolean = true;
  newUserName: string = "";
  newUserPassword: string = "";
  newUserRole: string = "";
  nameError = false;
  nameErrorMessage = '';
  passwordError = false;
  passwordErrorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.loading = false;
  }

  private fetchAllUsers() {
    //Get Users from Backend
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
      }
    });
  }

  /**
   * Sets the current view and triggers the corresponding method.
   */
  setView(view: 'allUsers' | 'newUser'): void {
    this.currentView = view;

    // Call the appropriate method based on the selected view
    switch (view) {
      case 'allUsers':
        this.title = 'svi korisnici';
        this.fetchAllUsers();
        break;
      case 'newUser':
        this.title = 'novi korisnik';
        // Load "Create New User" View
        break;
    }
  }

  /**
   * Selects a user and updates the details on the right.
   */
  selectUser(user: User): void {
    if (this.selectedUser?.id === user.id) {
      this.selectedUser = null;
    } else {
      this.selectedUser = user;
    }
  }

  checkName() {
    if (!this.newUserName || this.newUserName.trim().length < 1) {
      this.nameError = true;
      this.nameErrorMessage = 'Unesi ime';
    } else {
      this.nameError = false;
      this.nameErrorMessage = '';
    }
  }

  checkPassword() {
    if (!this.newUserPassword || this.newUserPassword.trim().length < 1) {
      this.passwordError = true;
      this.passwordErrorMessage = 'Unesi šifru';
    } else {
      this.passwordError = false;
      this.passwordErrorMessage = '';
    }
  }

  saveUser() {
    let numValue: number = Number(this.newUserRole);
    let newUser: CreateUser = {
      name: this.newUserName,
      level: numValue,
      password: this.newUserPassword
    }
    this.userService.createNewUser(newUser).subscribe({
      next: value => {
        this.newUserName = '';
        this.newUserRole = '';
        this.newUserPassword = '';
      }
    });
  }
}
