import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CarAPI, SearchCar } from '@models/car';
import { InsurancePolicesAPI, InsurancePolicyAPI, SearchInsurancePolicy } from '@models/insurancepolicy';
import { SearchUser, UserAPI } from '@models/user';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, filter, tap, switchMap } from 'rxjs';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { SearchEndorsement, updateEndorsement, EndorsementAPI } from '@models/endorsement';
import { Router, ActivatedRoute } from '@angular/router';
import { requiredDisabledInput } from '../required-disabled-input.validator';

@Component({
  selector: 'app-edit-endorsement',
  templateUrl: './edit-endorsement.component.html',
  styleUrls: ['./edit-endorsement.component.scss']
})
export class EditEndorsementComponent implements OnInit, OnDestroy {

  @ViewChild('customerId', { static: true }) customerElement: ElementRef;
  @ViewChild('agentId', { static: true }) agentElement: ElementRef;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  days = 'يوم';
  currency = 'شيكل';

  cars: CarAPI[] = [];
  customers: UserAPI[] = [];
  insurancePolicies: InsurancePolicyAPI[] = [];
  endorsement!: EndorsementAPI;

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

  editEndorsementForm = this.fb.group({
    totalPrice: [ { value:'', disabled: true }, Validators.required ],
    expireDate: [ { value:'', disabled: true }, Validators.required ],
    note: [''],
    insurancePolicyId: [ '', Validators.required ],
    endorsementType: [ 0, Validators.required ],
    carId: [ '', Validators.required ],
  }, { validators: requiredDisabledInput([ 'carId', 'insurancePolicyId' ]) });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private customerElementId: ElementRef,
    private agentElementId: ElementRef,
    private route: ActivatedRoute,
    private router: Router) {
    this.customerElement = this.customerElementId;
    this.agentElement = this.agentElementId;
  }

  ngOnInit(): void {
    this.getPageData();
    this.searchCustomerAPI();
    this.searchCarAPI();
    this.searchInsurancePolicyAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPageData() {
    this.route.paramMap.subscribe({
      next: params => {
        const endorsementID = Number(params.get('id'));
        // console.log("insurancePolicyID", insurancePolicyID);
        if (!endorsementID) { this.router.navigate(['/admin/endorsement/show']); }
        this.getEndorsement(endorsementID!);
      }
    });
  }

  getEndorsement(endorsementId: number) {
    const searchConditions: SearchEndorsement = { endorsementId } as SearchEndorsement;
    this.adminService.EndorsementsAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          if (response.data && response.data.length) {
            this.endorsement = response.data[0];
            this.buildForm();
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  buildForm(): void {
    this.selectedCustomer = this.endorsement.InsurancePolicy.Customer;
    this.selectedAgent = this.endorsement.InsurancePolicy.Agent;
    this.selectedInsurancePolicy = this.endorsement.InsurancePolicy;
    this.selectedCar = this.endorsement.InsurancePolicy.Car;
    this.editEndorsementForm.setValue({
      totalPrice: this.endorsement.totalPrice,
      expireDate: this.endorsement.expireDate,
      note: this.endorsement.note || '',
      endorsementType: this.endorsement.endorsementType,
      insurancePolicyId: this.endorsement.InsurancePolicy.id,
      carId: this.endorsement.Car.id,
    });
  }

  updateEndorsement = (ngform: FormGroupDirective) => {
    console.log(this.editEndorsementForm);
    if (this.editEndorsementForm.invalid) { return; }

    let formObj: updateEndorsement = this.editEndorsementForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });
    this.adminService.EndorsementsAPIs.update(this.endorsement.id, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
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

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCarText$.next(typeTxt);
    }
  }

  selectInsurancePolicy(event: Event) {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolicies!, controlValue) as InsurancePolicyAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchInsurancePolicyText$.next(typeTxt);
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
        this.searchTextObj.searchInsurancePolicyText$.next('');
        this.searchTextObj.searchCarText$.next('');
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
        debounceTime(500),
        distinctUntilChanged(),
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
        debounceTime(500),
        distinctUntilChanged(),
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
      this.editEndorsementForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
    }, 0);
  }

  formCont(controlName: string): any {
    return this.editEndorsementForm.controls[controlName];
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

    this.formCont('insurancePolicyId').disable();
    this.formCont('carId').disable();
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
