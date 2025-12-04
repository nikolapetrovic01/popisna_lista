import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {NgIf} from "@angular/common";
import {WorkerHigherLevelComponent} from "../worker-higher-level/worker-higher-level.component";
import {WorkerLowerLevelComponent} from "../worker-lower-level/worker-lower-level.component";

@Component({
  selector: 'app-worker-dashboard',
  standalone: true,
  imports: [
    NgIf,
    WorkerHigherLevelComponent,
    WorkerLowerLevelComponent
  ],
  templateUrl: './worker-dashboard.component.html',
  styleUrl: './worker-dashboard.component.css'
})
export class WorkerDashboardComponent implements OnInit {
  level: number | null = null;

  constructor (private userService: UserService) {}

  ngOnInit() {
    this.level = this.userService.getUserLevel();
  }
}
