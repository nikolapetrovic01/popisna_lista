import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerInventoryViewComponent } from './worker-inventory-view.component';

describe('WorkerInventoryViewComponent', () => {
  let component: WorkerInventoryViewComponent;
  let fixture: ComponentFixture<WorkerInventoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerInventoryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerInventoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
