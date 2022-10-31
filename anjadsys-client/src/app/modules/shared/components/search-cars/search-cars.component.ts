import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserAPI } from '@models/user';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { SearchCar } from '@models/car';

@Component({
  selector: 'app-search-cars',
  templateUrl: './search-cars.component.html',
  styleUrls: ['./search-cars.component.scss'],
  animations: [
    trigger('openClosed', [
      state('open', style({
        height: 'max-content',
        minHeight: '188px'
      })),
      state('closed', style({
        height: '0',
        minHeight: '0'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ])
    ]),
    trigger('showHideForm', [
      state('show', style({
        display: 'flex',
      })),
      state('hide', style({
        display: 'none',
      })),
      transition('show => hide', [
        animate('0.2s')
      ]),
      transition('hide => show', [
        animate('0.2s')
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCarsComponent {

  @Output() submittedSearch = new EventEmitter<SearchCar>();
  @Output() searchCustomerEvent = new EventEmitter<Event>();
  @Output() selectedCustomer = new EventEmitter<UserAPI | undefined>();
  @Input() customers: UserAPI[] = [];
  @Input() spinner = new BehaviorSubject<boolean>(false);

  internalSelectedCustomer: UserAPI | undefined = undefined;
  isOpen = false;

  searchCarForm = this.fb.group({
    customerID: [''],
    carNumber: [''],
    serialNumber: [''],
  });

  constructor(private fb: FormBuilder) { }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  formCont(controlName: string) {
    return this.searchCarForm.controls[controlName];
  }

  searchCar(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchCar = {} as SearchCar;
    keys.forEach(key => {
      searchConditions[key] = this.searchCarForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.submittedSearch.emit(searchConditions);
  }

  searchCustomer(event: Event): void {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerID')?.value;
      this.internalSelectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      this.selectedCustomer.emit(this.internalSelectedCustomer);
      return;
    }
    this.searchCustomerEvent.emit(event);
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI {
    // event.preventDefault();
    // event.stopPropagation();
    let selectedOne: UserAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  cancelCustomerInput(event: Event): void {
    // event.preventDefault();
    // event.stopImmediatePropagation();
    this.internalSelectedCustomer = undefined;
    this.formCont('customerID').setValue('');
    this.selectedCustomer.emit(this.internalSelectedCustomer);
  }

}
