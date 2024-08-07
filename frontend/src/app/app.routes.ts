import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {ControllerComponent} from "./component/controller/controller.component";
import {InventoriesComponent} from "./component/controller/inventories/inventories.component";
import {
  CreateNewInventoryComponent
} from "./component/controller/create/create-new-inventory/create-new-inventory.component";
import {ShowCsvContentComponent} from "./component/controller/create/show-csv-content/show-csv-content.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'controller', children: [
      {path: '', component: ControllerComponent},
      {path: 'inventory/:id', component: InventoriesComponent},
      {path: 'create', component: CreateNewInventoryComponent},
      {path: 'create/show-csv', component: ShowCsvContentComponent},
    ]
  }
];
