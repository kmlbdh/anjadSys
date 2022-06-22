import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { SearchUser, UserAPI } from '../../../../model/user';
import {
  InsurancePolicesAPI,
  InsurancePolicyAPI,
  SearchInsurancePolicy
} from 'src/app/modules/core/model/insurancepolicy';

@Component({
  selector: 'app-add-otherservices',
  templateUrl: './add-otherservices.component.html',
  styleUrls: ['./add-otherservices.component.scss']
})
export class AddOtherservicesComponent implements OnDestroy {

  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  insurancePolicyNotValidMsg: string | undefined;

  TIMEOUTMILISEC = 7000;

  insurancePolicies: InsurancePolicyAPI[] = [];
  // agents: UserAPI[] = [];
  customers: UserAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  // selectedAgent: UserAPI | undefined | null;
  selectedInsurancePolicy: InsurancePolicyAPI | undefined;

  spinner = {
    customer: false,
    // agent: false,
    insurancePolicy: false,
  };

  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCustomerText$: new Subject<string>(),
  };
  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];

  fileStatusArr = [ 'مفتوح', 'مغلق' ];
  serviceKindArr = [ 'خدمة تحقيق', 'خدمة متابعة' ];

  addOtherServiceForm = this.fb.group({
    name: [ '', Validators.required ],
    fileStatus: [ this.fileStatusArr[0], Validators.required ],
    serviceKind: [ null, Validators.required ],
    descCustomer: [ '', Validators.required ],
    description: [ '', Validators.required ],
    cost: [ '', Validators.required ],
    customerId: [ '', Validators.required ],
    insurancePolicyId: [ '', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) {
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addOtherService = (ngForm: FormGroupDirective) => {
    if (this.addOtherServiceForm.invalid) { return; }

    let formObj = this.addOtherServiceForm.value;

    this.adminService.OtherServicesAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.resetForm(ngForm);
          }
          console.log(response);
        },
        error: err => {
          console.error(err.error);
          if (err?.error?.message)  {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });
    console.log(this.addOtherServiceForm.value);
    console.log(formObj);
  };

  searchCustomerAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.list(
      { username: val, role: 'customer', agent: true, skipLoadingInterceptor: true } as SearchUser);
    this.searchTextObj.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinner.customer = true),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinner.customer = false;
          // console.log(response);
        },
        error: (err: any) => {
          this.spinner.customer = false;
          console.log(err);
        }
      });
  }

  searchCustomer(event: Event): void {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      // if(this.selectedCustomer) this.selectedAgent = this.selectedCustomer.Agent;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }
  }

  getInsurancePolicies() {
    this.spinner.insurancePolicy = true;
    console.log(this.selectedCustomer);
    if (!this.selectedCustomer) {
      this.spinner.insurancePolicy = false;
      return;
    }

    let customerId = this.selectedCustomer!.id;
    this.insurancePolicyNotValidMsg = undefined;
    let searchConditions: SearchInsurancePolicy = { customerID: customerId, filterOutValid: true };
    this.adminService.InsurancePoliciesAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            this.insurancePolicies = response.data;
          }
          this.spinner.insurancePolicy = false;
        },
        error: (error: any) => {
          if (error.error.message) { this.insurancePolicyNotValidMsg = error.error.message; }
          this.spinner.insurancePolicy = false;
          console.log(error);
        }
      });
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any):
   UserAPI | InsurancePolicyAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | InsurancePolicyAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }
    console.log(event);
    setTimeout(() => {
      this.getInsurancePolicies();
    }, 0);
  }

  selectInsurancePolicy(event: Event) {
    // console.log('change', event);
    if (event.type === 'change') {
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolicies!, controlValue) as InsurancePolicyAPI;
      // console.log(this.selectedInsurancePolicy);
      return;
    }
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');

    this.cancelInsurancePolicyInput(event);
  }

  cancelInsurancePolicyInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedInsurancePolicy = undefined;
    this.formCont('insurancePolicyId').setValue('');
  }

  resetForm(ngform: FormGroupDirective) {
    this.addOtherServiceForm.reset();
    this.addOtherServiceForm.updateValueAndValidity();
    this.addOtherServiceForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any {
    return this.addOtherServiceForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean {
    if (event instanceof KeyboardEvent) {
      const code = event.key;
      console.log(code);
      if (Number.isNaN(+code)) {
        if (!this.keys.includes(code.toLowerCase())) { return false; }
      }
    }
    return true;
  }

}
