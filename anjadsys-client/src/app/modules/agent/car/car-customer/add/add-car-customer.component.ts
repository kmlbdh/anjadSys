import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CarModelAPI } from '@models/car';
import { UserAPI } from '@models/user';
import { AgentService } from '../../../agent.service';

@Component({
  selector: 'app-add-car-customer',
  templateUrl: './add-car-customer.component.html',
  styleUrls: ['./add-car-customer.component.scss']
})
export class AddCarCustomerComponent implements OnInit, OnDestroy {

  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;

  carTypes!: any[];
  carModels: any[] | undefined;
  customers: any[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedCarTypeId: number | undefined;
  selectedCarModel: CarModelAPI | undefined;

  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];
  private unsubscribe$ = new Subject<void>();
  private searchCustomerText$ = new Subject<string>();

  TIMEOUTMILISEC = 7000;

  licenseTypes = [
    'خصوصي',
    'مركبة موحدة',
    'عمومي',
    'مركبة ايجار',
    'تعليم سواقة',
    'شحن',
    'اخرى'
  ];

  spinner = {
    carModel: false,
    customer: false,
  };

  addCarForm = this.fb.group({
    carNumber: [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(10) ] ],
    motorNumber: [ '', [ Validators.required, Validators.minLength(8), Validators.maxLength(8) ] ],
    motorPH: [ '', Validators.required ],
    licenseType: [ '', Validators.required ],
    serialNumber: [ '', Validators.required ],
    passengersCount: [ '', Validators.required ],
    productionYear: [ '', Validators.required ],
    color: [ '', Validators.required ],
    note: [''],
    customerId: [ '', Validators.required ],
    carTypeId: [ '', Validators.required ],
    carModelId: [ { value: '', disabled: true }, Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService) { }

  ngOnInit(): void {
    this.searchCustomerAPI();
    this.getCarTypes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCar = (ngform: FormGroupDirective) => {
    console.log(this.addCarForm);
    if (this.addCarForm.invalid) { return; }

    let formObj = this.addCarForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });

    this.agentService.CarsAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.resetForm(ngform);
          }
          console.log(response);
        },
        error: err => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });
    console.log(this.addCarForm.value);
    console.log(formObj);
  };


  searchCustomer(event: Event) {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.customers.filter((customer: any) => customer.id == controlValue)[0];
      return;
    }

    let customerText = ((event.target as HTMLInputElement).value)?.trim();
    if (customerText && customerText !== '') {
      this.spinner.customer = true;
      this.searchCustomerText$.next(customerText);
    }
  }

  getCarTypes() {
    this.agentService.CarTypesAPIs.list({ limit: 999999999999999 })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data && response.data.length) {
            this.carTypes = response.data;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  searchCarModelAPI() {
    this.agentService.CarModelsAPIs.list({
      carTypeId: Number(this.selectedCarTypeId),
      skipLoadingInterceptor: true
    })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data && response.data.length) {
            this.carModels = response.data;
            this.formCont('carModelId').enable();
          } else {
            this.carModels = [];
          }
          this.spinner.carModel = false;
        },
        error: (err: any) => {
          this.spinner.carModel = false;
          console.log(err);
        }
      });
  }

  searchCustomerAPI() {
    this.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.spinner.customer = true),
        switchMap(text =>
          this.agentService.UsersAPI.show({ username: text, skipLoadingInterceptor: true })
        )
      )
      .subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinner.customer = false;
          console.log(response);
        },
        error: (err: any) => {
          this.spinner.customer = false;
          console.log(err);
        }
      });
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');
  }

  resetForm(ngform: FormGroupDirective) {
    this.selectedCarTypeId = undefined;
    this.selectedCustomer = undefined;
    this.addCarForm.reset();
    this.addCarForm.updateValueAndValidity();
    this.addCarForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any {
    return this.addCarForm.controls[controlName];
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

  toggleModel() {
    this.selectedCarTypeId = this.formCont('carTypeId').value;
    if (!this.selectedCarTypeId)
    { this.formCont('carModelId').disable(); }
    else {
      this.spinner.carModel = true;
      this.searchCarModelAPI();
    }
  }

}
