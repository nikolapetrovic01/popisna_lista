  import { Component } from '@angular/core';
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
      private userLevelService: UserService) {}


    onSubmit() {
      if (this.loginForm.valid) {
        const loginData: loginRequest = {
          name: this.loginForm.value.name || '', // Ensuring a default empty string if null or undefined
          password: this.loginForm.value.password || '' // Similarly, ensuring password is not null or undefined
        };

        this.authService.login(loginData).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            // Navigate based on level
            switch (response.level) {
              case 0:
                console.log("0");
                break;
              case 1:
                //This is the controller case
                console.log("Controller");

                this.userLevelService.clearUserLevel();
                this.userLevelService.clearUserId();
                this.userLevelService.setUserLevel(1);
                this.userLevelService.setUserId(response.id);

                this.router.navigate(['/controller']).catch(err => console.log("The error: ",err));
                break;
              case 2:
                // this.router.navigate(['/admin']);
                console.log("Worker/Worker Admin");
                this.router.navigate(['/worker']).catch(err => console.log("The error: ",err));
                break;
              case 3:
                // this.router.navigate(['/superadmin']);
                console.log("3");
                break;
              default:
                // this.router.navigate(['/home']);
                console.log("default");
                break;
            }
          },
          error: (error) => {
            console.error('Login failed', error);
            this.snackBar.open(`Login Failed: ${error}`, 'Close', {
              duration: 3000,
              verticalPosition: "top",
              horizontalPosition: "right"
            });
          }
        });
      }
    }
  }
