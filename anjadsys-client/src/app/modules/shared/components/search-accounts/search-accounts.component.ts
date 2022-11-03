import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective } from '@angular/forms';
import { SearchAccount } from '@models/account';
import { UserAPI } from '@models/user';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search-accounts',
  templateUrl: './search-accounts.component.html',
  styleUrls: ['./search-accounts.component.scss'],
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
export class SearchAccountsComponent implements OnInit {

  @Output() submittedSearch = new EventEmitter<SearchAccount>();

  @Output() searchCustomerEvent = new EventEmitter<Event>();
  @Output() searchSupplierEvent = new EventEmitter<Event>();
  @Output() searchAgentEvent = new EventEmitter<Event>();

  @Output() selectedSupplier = new EventEmitter<UserAPI | undefined>();
  @Output() selectedAgent = new EventEmitter<UserAPI | undefined>();
  @Output() selectedCustomer = new EventEmitter<UserAPI | undefined>();

  @Input() suppliers: UserAPI[] = [];
  @Input() agents: UserAPI[] = [];
  @Input() customers: UserAPI[] = [];

  @Input() spinnerCustomer = new BehaviorSubject<boolean>(false);
  @Input() spinnerSupplier = new BehaviorSubject<boolean>(false);
  @Input() spinnerAgent = new BehaviorSubject<boolean>(false);

  @Input() isSupplierActive:boolean = false;
  @Input() isAgentActive:boolean = false;
  @Input() isCustomerActive:boolean = false;

  internalSelectedSupplier: UserAPI | undefined = undefined;
  internalSelectedAgent: UserAPI | undefined = undefined;
  internalSelectedCustomer: UserAPI | undefined = undefined;

  isOpen = false;

  private currentDate = new Date();

  firstDayOfMonth = (new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)).toISOString().substring(0, 10);
  lastDayOfMonth = (new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)).toISOString().substring(0, 10);

  searchAccountForm = this.fb.group({
    accountId: [''],
    insurancePolicyId: [''],
    startDate: [this.firstDayOfMonth],
    endDate: [this.lastDayOfMonth],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.isAgentActive) { this.searchAccountForm.addControl('agentID', new FormControl('')); }
    if (this.isSupplierActive) { this.searchAccountForm.addControl('supplierID', new FormControl('')); }
    if (this.isCustomerActive) { this.searchAccountForm.addControl('customerID', new FormControl('')); }
  }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  formCont(controlName: string) {
    return this.searchAccountForm.controls[controlName];
  }

  searchAccount(form: FormGroupDirective) {
    if (form.invalid) { return; }

    let keys = Object.keys(form.value);
    let searchConditions: SearchAccount = {};

    keys.forEach(key => {
      searchConditions[key] = this.searchAccountForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '')
      { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.submittedSearch.emit(searchConditions);
  }

  searchAgent(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('agentID')?.value;
      this.internalSelectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      return;
    }
    this.searchAgentEvent.emit(event);
  }

  searchSupplier(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('supplierID')?.value;
      this.internalSelectedSupplier = this.mouseEventOnSearch(event, this.suppliers!, controlValue) as UserAPI;
      return;
    }
    this.searchSupplierEvent.emit(event);
  }

  searchCustomer(event: Event): void {
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerID')?.value;
      this.internalSelectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      return;
    }
    this.searchCustomerEvent.emit(event);
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI {
    let selectedOne: UserAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  cancelAgentInput(event: Event): void {
    this.internalSelectedAgent = undefined;
    this.formCont('agentID').setValue('');
    this.selectedAgent.emit(this.internalSelectedAgent);
  }

  cancelSupplierInput(event: Event): void {
    this.internalSelectedSupplier = undefined;
    this.formCont('supplierID').setValue('');
    this.selectedSupplier.emit(this.internalSelectedSupplier);
  }

  cancelCustomerInput(event: Event): void {
    this.internalSelectedCustomer = undefined;
    this.formCont('customerID').setValue('');
    this.selectedCustomer.emit(this.internalSelectedCustomer);
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }

    if (this.isAgentActive && this.isCustomerActive) {
      setTimeout(() => {
        this.searchAccountForm.get('agentID')?.setValue(this.internalSelectedAgent?.id);
      }, 0);
    }
  }

}
