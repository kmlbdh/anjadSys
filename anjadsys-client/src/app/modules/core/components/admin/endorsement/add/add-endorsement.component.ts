import { InsurancePolicesAPI, InsurancePolicyAPI, SearchInsurancePolicy } from './../../../../model/insurancepolicy';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CarAPI, SearchCar } from 'src/app/modules/core/model/car';
import { SearchUser, UserAPI } from 'src/app/modules/core/model/user';
import { Subject, takeUntil, debounceTime, tap, switchMap, distinctUntilChanged, filter } from 'rxjs';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { NewEndorsement } from '../../../../model/endorsement';
import { requiredDisabledInput } from '../required-disabled-input.validator';

@Component({
  selector: 'app-add-endorsement',
  templateUrl: './add-endorsement.component.html',
  styleUrls: ['./add-endorsement.component.scss']
})
export class AddEndorsementComponent implements OnInit, OnDestroy {

  @ViewChild('customerId', { static: true }) customerElement: ElementRef;
  @ViewChild('agentId', { static: true }) agentElement: ElementRef;

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  days = 'يوم';
  currency = 'شيكل';

  cars: CarAPI[] = [];
  customers: UserAPI[] = [];
  insurancePolicies: InsurancePolicyAPI[] = [];

  selectedInsurancePolicy: InsurancePolicyAPI | undefined;
  selectedCustomer: UserAPI | undefined;
  selectedAgent: UserAPI | undefined;
  selectedCar: CarAPI | undefined;

  spinner = {
    customer: false,
    car: false,
    insurancePolicy: false,
  };

  endorsementTypeArray = ['نقل ملكية'];

  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];

  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCarText$:  new Subject<string>(),
    searchCustomerText$: new Subject<string>(),
    searchInsurancePolicyText$: new Subject<string>()
  };

  TIMEOUTMILISEC = 7000;

  addEndorsementForm = this.fb.group({
    totalPrice: [ { value:'', disabled: true }, Validators.required ],
    expireDate: [ { value:'', disabled: true }, Validators.required ],
    note: [''],
    insurancePolicyId: [ { value:'', disabled: true }, Validators.required ],
    endorsementType: [ 0, Validators.required ],
    carId: [ { value:'', disabled: true }, Validators.required ],
  }, { validators: requiredDisabledInput([ 'carId', 'insurancePolicyId' ]) });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private customerElementId: ElementRef,
    private agentElementId: ElementRef) {
    this.customerElement = this.customerElementId;
    this.agentElement = this.agentElementId;
  }

  ngOnInit(): void {
    this.searchCustomerAPI();
    this.searchCarAPI();
    this.searchInsurancePolicyAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addEndorsement = (ngform: FormGroupDirective) => {
    if (this.addEndorsementForm.invalid) { return; }

    let formObj: NewEndorsement = this.addEndorsementForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });
    this.adminService.EndorsementsAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.resetEndrosementForm(ngform);
          }
          // console.log(response);
        },
        error: (err: any) => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });
    // console.log(formObj);
    // console.log(this.addServicePolicyForm.value);
  };

  selectCar(event: Event, ngform: FormGroupDirective) {
    console.log(ngform);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('carId')?.value;
      this.selectedCar = this.mouseEventOnSearch(event, this.cars!, controlValue) as CarAPI;
      return;
    }
  }

  selectInsurancePolicy(event: Event) {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolicies!, controlValue) as InsurancePolicyAPI;
      return;
    }
  }

  searchCustomer(event: Event): void {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.customerElement.nativeElement.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      if (this.selectedCustomer) { this.selectedAgent = this.selectedCustomer.Agent; }
      this.agentElement.nativeElement.value = (this.selectedAgent?.id);
      setTimeout(() => {
        this.searchTextObj.searchCarText$.next('');
        this.searchTextObj.searchInsurancePolicyText$.next('');
      }, 0);
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI | CarAPI | InsurancePolicyAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | CarAPI | InsurancePolicyAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

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
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.customer = false;
        }
      });
  }

  searchCarAPI() {
    let callback = () => {
      const query: SearchCar =  { customerID: this.selectedCustomer?.id,  skipLoadingInterceptor: true };
      return this.adminService.CarsAPIs.show(query);
    };
    this.searchTextObj.searchCarText$
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.spinner.car = true),
        switchMap(() => callback())
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.cars = response.data;
            this.formCont('carId').enable();
          }
          this.spinner.car = false;
          // console.log(response);
        },
        error: (err: any) => {
          this.spinner.car = false;
          console.log(err);
        }
      });
  }

  searchInsurancePolicyAPI() {
    let callback = () => {
      const query: SearchInsurancePolicy =  { customerID: this.selectedCustomer?.id,  skipLoadingInterceptor: true };
      return this.adminService.InsurancePoliciesAPIs.list(query);
    };
    this.searchTextObj.searchInsurancePolicyText$
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.spinner.insurancePolicy = true),
        switchMap(() => callback())
      ).subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            this.insurancePolicies = response.data;
            this.formCont('insurancePolicyId').enable();
          }
          this.spinner.insurancePolicy = false;
          // console.log(response);
        },
        error: (err: any) => {
          this.spinner.insurancePolicy = false;
          console.log(err);
        }
      });
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }

    setTimeout(() => {
      this.addEndorsementForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
    }, 0);
  }

  resetEndrosementForm(addEndrosementFormDirective: FormGroupDirective) {
    this.addEndorsementForm.reset();
    this.addEndorsementForm.updateValueAndValidity();
    this.addEndorsementForm.markAsUntouched();
    addEndrosementFormDirective.resetForm();

    this.customerElement.nativeElement.value = null;
    this.agentElement.nativeElement.value = null;
    this.selectedCustomer = undefined;
    this.selectedAgent = undefined;
    this.selectedCar = undefined;
    this.selectedInsurancePolicy = undefined;
  }

  formCont(controlName: string): any {
    return this.addEndorsementForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean {
    if (event instanceof KeyboardEvent) {
      const code = event.key;
      // console.log(code);
      if (Number.isNaN(+code)) {
        if (!this.keys.includes(code.toLowerCase())) { return false; }
      }
    }
    return true;
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCustomer = undefined;
    this.selectedInsurancePolicy = undefined;
    this.selectedAgent = undefined;

    this.customerElement.nativeElement.value = '';
    this.agentElement.nativeElement.value = '';

    this.formCont('carId').disable();
    this.formCont('insurancePolicyId').disable();

    this.cancelInsurancePolicyInput(event);
    this.cancelCarInput(event);
  }

  cancelCarInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCar = undefined;
    this.formCont('carId').setValue('');
  }

  cancelInsurancePolicyInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedInsurancePolicy = undefined;
    this.formCont('insurancePolicyId').setValue('');
  }

  trackById(_index: number, el: any) {
    return el.id;
  }

}
