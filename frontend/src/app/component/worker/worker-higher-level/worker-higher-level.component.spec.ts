import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerHigherLevelComponent } from './worker-higher-level.component';

describe('WorkerHigherLevelComponent', () => {
  let component: WorkerHigherLevelComponent;
  let fixture: ComponentFixture<WorkerHigherLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerHigherLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerHigherLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
