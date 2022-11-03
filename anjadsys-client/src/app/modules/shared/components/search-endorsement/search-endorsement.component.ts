import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserAPI } from '@models/user';
import { BehaviorSubject } from 'rxjs';
import { SearchEndorsement } from '../../../core/model/endorsement';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-search-endorsement',
  templateUrl: './search-endorsement.component.html',
  styleUrls: ['./search-endorsement.component.scss'],
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
export class SearchEndorsementComponent {

  @Output() submittedSearch = new EventEmitter<SearchEndorsement>();
  @Output() searchCustomerEvent = new EventEmitter<Event>();
  @Output() selectedCustomer = new EventEmitter<UserAPI | undefined>();
  @Input() customers: UserAPI[] = [];
  @Input() spinnerCustomer = new BehaviorSubject<boolean>(false);

  internalSelectedCustomer: UserAPI | undefined = undefined;
  isOpen = false;

  searchEndorsementForm = this.fb.group({
    endorsementId: [''],
    insurancePolicyId: [''],
    customerId: [''],
    endorsementType: [''],
  });

  endorsementTypeArray = ['نقل ملكية'];

  constructor(private fb: FormBuilder) { }

  showSearch() {
    this.isOpen = !this.isOpen;
  }

  formCont(controlName: string) {
    return this.searchEndorsementForm.controls[controlName];
  }

  searchEndorsement(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchEndorsement = {} as SearchEndorsement;
    keys.forEach(key => {
      searchConditions[key] = this.searchEndorsementForm.get(key)?.value;
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
      this.searchEndorsementForm.get('agentID')?.disable();
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
    this.formCont('customerId').setValue('');
    this.selectedCustomer.emit(this.internalSelectedCustomer);
  }

}
