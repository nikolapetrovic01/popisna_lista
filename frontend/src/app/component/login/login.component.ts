import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {loginService} from "../../service/login.service";
import {loginRequest} from "../../dto/login";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: loginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userLevelService: UserService
  ) {
  }

  /**
   * Handles form submission for the login process.
   * Validates the form, constructs the login request, and navigates based on user level.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: loginRequest = {
        name: this.loginForm.value.name || '', // Ensuring a default empty string if null or undefined
        password: this.loginForm.value.password || '' // Similarly, ensuring password is not null or undefined
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          // Navigate based on level
          switch (response.level) {
            case 0:
              break;
            case 1:
              //This is the controller case
              this.setUp(1, response.id);

              this.router.navigate(['/controller']).catch(err => console.log("The error: ", err));
              break;
            case 2:
              this.setUp(2, response.id);

              this.router.navigate(['/worker/dashboard']).catch(err => console.log("The error: ", err));
              break;
            case 3:
              this.setUp(3, response.id);

              this.router.navigate(['/worker/dashboard']).catch(err => console.log("The error: ", err));
              break;
            default:
              break;
          }
        },
        error: (error) => {
          this.snackBar.open(`Login nije uspjeo: ${error}`, 'Close', {
            duration: 3000,
            verticalPosition: "top",
            horizontalPosition: "right"
          });
        }
      });
    }
  }

  private setUp(userLevel: number, userId: number) {
    this.userLevelService.clearUserLevel();
    this.userLevelService.clearUserId();
    this.userLevelService.setUserLevel(userLevel);
    this.userLevelService.setUserId(userId);
  }
}
