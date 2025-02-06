import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {ControllerComponent} from "./component/controller/controller.component";
import {InventoriesComponent} from "./component/controller/inventories/inventories.component";
import {CreateNewInventoryComponent} from "./component/controller/create/create-new-inventory/create-new-inventory.component";
import {ShowCsvContentComponent} from "./component/controller/create/show-csv-content/show-csv-content.component";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'controller', canActivate: [authGuard] ,children: [
      {path: '', component: ControllerComponent, data: {requiredLevel: 1}},
      {path: 'inventory/:id', component: InventoriesComponent, data: {requiredLevel: 1}},
      {path: 'create', component: CreateNewInventoryComponent, data: {requiredLevel: 1}},
      {path: 'create/show-csv', component: ShowCsvContentComponent, data: {requiredLevel: 1}},
    ]
  }
];
