import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCsvContentComponent } from './show-csv-content.component';

describe('ShowCsvContentComponent', () => {
  let component: ShowCsvContentComponent;
  let fixture: ComponentFixture<ShowCsvContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCsvContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCsvContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
