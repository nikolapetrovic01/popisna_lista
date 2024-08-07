import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewInventoryComponent } from './create-new-inventory.component';

describe('CreateNewInventoryComponent', () => {
  let component: CreateNewInventoryComponent;
  let fixture: ComponentFixture<CreateNewInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
