import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSuppAccountComponent } from './search-supp-account.component';

describe('SearchSuppAccountComponent', () => {
  let component: SearchSuppAccountComponent;
  let fixture: ComponentFixture<SearchSuppAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSuppAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSuppAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
