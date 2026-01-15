import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarInputs } from './calendar-inputs';

describe('CalendarInputs', () => {
  let component: CalendarInputs;
  let fixture: ComponentFixture<CalendarInputs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarInputs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarInputs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
