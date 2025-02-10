import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {NgIf} from "@angular/common";
import {WorkerHigherLevelComponent} from "../worker-higher-level/worker-higher-level.component";
import {WorkerLowerLevelComponent} from "../worker-lower-level/worker-lower-level.component";
import {
  WorkerHigherLevelInventoryComponent
} from "../worker-higher-level/inventory/worker-higher-level-inventory/worker-higher-level-inventory.component";
import {
  WorkerLowerLevelInventoryComponent
} from "../worker-lower-level/worker-lower-level-inventory/worker-lower-level-inventory.component";

@Component({
  selector: 'app-worker-inventory-view',
  standalone: true,
  imports: [
    NgIf,
    WorkerHigherLevelComponent,
    WorkerLowerLevelComponent,
    WorkerHigherLevelInventoryComponent,
    WorkerLowerLevelInventoryComponent
  ],
  templateUrl: './worker-inventory-view.component.html',
  styleUrl: './worker-inventory-view.component.css'
})
export class WorkerInventoryViewComponent implements OnInit{
  level: number | null = null;
  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.level = this.userService.getUserLevel();
  }
}
