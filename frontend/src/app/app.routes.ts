import { Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {ControllerComponent} from "./component/controller/controller.component";
import {InventoriesComponent} from "./component/controller/inventories/inventories.component";
import {CreateNewInventoryComponent} from "./component/controller/create/create-new-inventory/create-new-inventory.component";
import {ShowCsvContentComponent} from "./component/controller/create/show-csv-content/show-csv-content.component";
import {authGuard} from "./guards/auth.guard";
import {WorkerDashboardComponent} from "./component/worker/dashboard/worker-dashboard.component";
import {WorkerInventoryViewComponent} from "./component/worker/inventory/worker-inventory-view/worker-inventory-view.component";
import {UserManagementComponent} from "./component/user-management/user-management.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'controller', canActivate: [authGuard] ,children: [
      {path: '', component: ControllerComponent, data: {requiredLevel: 1}},
      {path: 'inventory/:id', component: InventoriesComponent, data: {requiredLevel: 1}},
      {path: 'create', component: CreateNewInventoryComponent, data: {requiredLevel: 1}},
      {path: 'create/show-csv', component: ShowCsvContentComponent, data: {requiredLevel: 1}},
      {path: 'users/manage', component: UserManagementComponent, data: {requiredLevel: 1}},
    ]
  },
  {
    path: 'worker', canActivate: [authGuard] ,children: [
      {path: '', component: ControllerComponent, data: {requiredLevel: 2}},
      {path: 'dashboard', component: WorkerDashboardComponent, data: {requiredLevel: [2,3]}},
      {path: 'inventory/:id', component: WorkerInventoryViewComponent, data: {requiredLevel: [2,3]}},
    ]
  }
];
