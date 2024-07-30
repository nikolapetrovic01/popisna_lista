import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryItemComponent } from './list-inventory-item.component';

describe('InventoryItemComponent', () => {
  let component: ListInventoryItemComponent;
  let fixture: ComponentFixture<ListInventoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInventoryItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInventoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
