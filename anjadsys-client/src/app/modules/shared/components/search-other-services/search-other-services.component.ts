import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchOtherServices } from '@models/otherservices';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserAPI } from '../../../core/model/user';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search-other-services',
  templateUrl: './search-other-services.component.html',
  styleUrls: ['./search-other-services.component.scss'],
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
export class SearchOtherServicesComponent {

  @Output() submittedSearch = new EventEmitter<SearchOtherServices>();
  @Output() searchCustomerEvent = new EventEmitter<Event>();
  @Output() selectedCustomer = new EventEmitter<UserAPI | undefined>();
  @Input() customers: UserAPI[] = [];
  @Input() spinner = new BehaviorSubject<boolean>(false);

  internalSelectedCustomer: UserAPI | undefined = undefined;
  isOpen = false;
  private currentDate = new Date();

  firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);

  fileStatusArr = [ 'مفتوح', 'مغلق' ];

  searchOtherServiceForm = this.fb.group({
    otherServiceID: [''],
    insurancePolicyId: [''],
    customerID: [''],
    fileStatus: [''],
    serviceKind: [''],
    startDate: [this.firstDayOfMonth.toISOString().substring(0, 10)],
    endDate: [this.lastDayOfMonth.toISOString().substring(0, 10)],
  });

  constructor(private fb: FormBuilder) { }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  searchOtherService(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchOtherServices = {} as SearchOtherServices;

    keys.forEach(key => {
      searchConditions[key] = this.searchOtherServiceForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });

    this.submittedSearch.emit(searchConditions);
  }

  searchCustomer(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerID')?.value;
      this.internalSelectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      this.selectedCustomer.emit(this.internalSelectedCustomer);
      return;
    }
    this.searchCustomerEvent.emit(event);
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI {
    let selectedOne: UserAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  cancelCustomerInput(event: Event): void {
    this.internalSelectedCustomer = undefined;
    this.formCont('customerID').setValue('');
    this.selectedCustomer.emit(this.internalSelectedCustomer);
  }

  formCont(controlName: string) {
    return this.searchOtherServiceForm.controls[controlName];
  }

}
