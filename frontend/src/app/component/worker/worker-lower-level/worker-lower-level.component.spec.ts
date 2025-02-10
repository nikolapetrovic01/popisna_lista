import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerLowerLevelComponent } from './worker-lower-level.component';

describe('WorkerLowerLevelComponent', () => {
  let component: WorkerLowerLevelComponent;
  let fixture: ComponentFixture<WorkerLowerLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerLowerLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerLowerLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
