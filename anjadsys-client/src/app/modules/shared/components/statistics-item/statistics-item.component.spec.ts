import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsItemComponent } from './statistics-item.component';

describe('StatisticsItemComponent', () => {
  let component: StatisticsItemComponent;
  let fixture: ComponentFixture<StatisticsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
