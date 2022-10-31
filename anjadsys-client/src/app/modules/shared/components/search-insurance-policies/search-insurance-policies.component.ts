import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { UserAPI } from '@models/user';
import { BehaviorSubject } from 'rxjs';
import { SearchInsurancePolicy } from '../../../core/model/insurancepolicy';

@Component({
  selector: 'app-search-insurance-policies',
  templateUrl: './search-insurance-policies.component.html',
  styleUrls: ['./search-insurance-policies.component.scss'],
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
export class SearchInsurancePoliciesComponent {

  @Output() submittedSearch = new EventEmitter<SearchInsurancePolicy>();
  @Output() searchCustomerEvent = new EventEmitter<Event>();
  @Output() searchAgentEvent = new EventEmitter<Event>();
  @Output() selectedCustomer = new EventEmitter<UserAPI | undefined>();
  @Output() selectedAgent = new EventEmitter<UserAPI | undefined>();
  @Input() customers: UserAPI[] = [];
  @Input() agents: UserAPI[] = [];
  @Input() spinnerCustomer = new BehaviorSubject<boolean>(false);
  @Input() spinnerAgent = new BehaviorSubject<boolean>(false);

  internalSelectedCustomer: UserAPI | undefined = undefined;
  internalSelectedAgent: UserAPI | undefined = undefined;
  isOpen = false;

  searchInsurancePolicyForm = this.fb.group({
    insurancePolicyId: [''],
    customerID: [''],
    carID: [''],
    agentID: [''],
  });

  constructor(private fb: FormBuilder) { }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  formCont(controlName: string) {
    return this.searchInsurancePolicyForm.controls[controlName];
  }

  searchInsurancePolicy(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchInsurancePolicy = {};
    keys.forEach(key => {
      searchConditions[key] = this.searchInsurancePolicyForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.submittedSearch.emit(searchConditions);
  }

  searchCustomer(event: Event): void {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerID')?.value;
      this.internalSelectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      this.searchInsurancePolicyForm.get('agentID')?.disable();
      return;
    }
    this.searchCustomerEvent.emit(event);
  }

  searchAgent(event: Event): void {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('agentID')?.value;
      this.internalSelectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      this.searchInsurancePolicyForm.get('customerID')?.disable();
      return;
    }
    this.searchAgentEvent.emit(event);
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
    this.formCont('agentID').enable();
    this.selectedCustomer.emit(this.internalSelectedCustomer);
  }

  cancelAgentInput(event: Event): void {
    // event.preventDefault();
    // event.stopImmediatePropagation();
    this.internalSelectedAgent = undefined;
    this.formCont('agentID').setValue('');
    this.formCont('customerID')?.enable();
    this.selectedAgent.emit(this.internalSelectedAgent);
  }

}
