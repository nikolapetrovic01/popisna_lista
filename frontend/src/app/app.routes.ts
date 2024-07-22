import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {ControllerComponent} from "./component/controller/controller.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'controller', component: ControllerComponent, pathMatch: 'full'}
];
