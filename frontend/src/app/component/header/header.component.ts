import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {loginService} from "../../service/login.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public loginService: loginService) {}
}
