import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {loginService} from "../../service/login.service";
import {loginRequest} from "../../dto/login";

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

  constructor(private authService: loginService, private router: Router) {}


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
            case 1:
              // this.router.navigate(['/']);
              console.log("1");
              break;
            case 2:
              // this.router.navigate(['/admin']);
              console.log("2");
              break;
            case 3:
              // this.router.navigate(['/superadmin']);
              console.log("3");
              break;
            default:
              // this.router.navigate(['/home']);
              console.log("0");
              break;
          }
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}
