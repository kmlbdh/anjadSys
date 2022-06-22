import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  of,
  Subject,
  switchMap,
  takeUntil,
  mergeMap,
  tap,
  filter
} from 'rxjs';
import { CarAPI } from 'src/app/modules/core/model/car';
import { RegionAPI } from 'src/app/modules/core/model/general';
import { UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../admin.service';
import { SearchUser } from '../../../../model/user';
import { SearchCar } from '../../../../model/car';
import { NewServiceAccident, ServicePolicyAPI } from '../../../../model/service';
import { NewAccident } from '../../../../model/accident';
import {
  InsurancePolicyAPI,
  SearchInsurancePolicy,
  InsurancePolicesAPI
} from '../../../../model/insurancepolicy';

@Component({
  selector: 'app-add-accident',
  templateUrl: './add-accident.component.html',
  styleUrls: ['./add-accident.component.scss']
})
export class AddAccidentComponent implements OnInit, OnDestroy {

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  addServiceBtnIcon = faPlus;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  insurancePolicyNotValidMsg: string | undefined;

  days = 'يوم';
  currency = 'شيكل';

  servicesPolicies!: ServicePolicyAPI[];
  servicesAccident: NewServiceAccident[] = [];
  insurancePolicies: InsurancePolicyAPI[] = [];
  cars: CarAPI[] = [];
  agents: UserAPI[] = [];
  customers: UserAPI[] = [];
  suppliers: UserAPI[] = [];
  regions: RegionAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedAgent: UserAPI | undefined | null;
  selectedRegion: RegionAPI | undefined;
  selectedCar: CarAPI | undefined;
  selectedInsurancePolicy: InsurancePolicyAPI | undefined;
  selectedServicePolicy: ServicePolicyAPI | undefined;
  maxDays: number = 0;

  firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
  lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

  spinner = {
    customer: false,
    agent: false,
    car: false,
    supplier: false,
    insurancePolicy: false,
  };

  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];
  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCarText$:  new Subject<string>(),
    searchRegionText$: new Subject<string>(),
    searchCustomerText$: new Subject<string>(),
    searchAgentText$: new Subject<string>()
  };

  TIMEOUTMILISEC = 7000;

  addAccidentForm = this.fb.group({
    // name: ['', [Validators.required]],
    accidentPlace: [ '', Validators.required ],
    accidentDate: [ '', Validators.required ],
    registerAccidentDate: [ (new Date()).toISOString().substring(0, 10), Validators.required ],
    driverName: [ '', Validators.required ],
    driverIdentity: [ '', [ Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}') ] ],
    accidentDescription: [ '', Validators.required ],
    expectedCost: [ '', Validators.required ],
    note: [''],
    regionId: [ '', Validators.required ],
    customerId: [ '', Validators.required ],
    agentId: [ '', Validators.required ],
    carId: [ { value:'', disabled: true }, Validators.required ],
    insurancePolicyId: [ { value:'', disabled: true }, Validators.required ],
  });

  addServiceAccidentForm = this.fb.group({
    serviceId: [ { value: '', disabled: true }, Validators.required ],
    coverageDays: [ { value: '', disabled: true }, Validators.required ],
    // note: [''],
    // cost: [0, Validators.required],
    // supplierPercentage: ['', Validators.required],
    supplierId: [ { value: '', disabled: true }, Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getRegions();

    this.searchCarAPI();
    this.searchCustomerAPI();
    // this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addAccident = (ngform: FormGroupDirective) => {
    // console.log(this.addAccidentForm);
    if (this.addAccidentForm.invalid) { return; }

    let formObj: NewAccident = this.addAccidentForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '' || k === 'insurancePolicyId') { delete formObj[k]; }
    });

    formObj.services = [];
    this.servicesAccident.forEach(serviceAccident => {
      delete serviceAccident['Service'];
      formObj.services.push(serviceAccident);
    });

    // formObj.services = this.servicesAccident;
    // delete formObj['insurancePolicyId'];

    this.adminService.AccidentsAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data)
          { this.successMsg = response.message; }
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

          this.resetAccidentForm(ngform);
          // console.log(response);
        },
        error: (err: any) => {
          console.error(err.error);
          if (err?.error?.message)
          { this.errorMsg = err.error.message; }
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
        }
      });
    // console.log(this.addAccidentForm.value);
    // console.log(formObj);
  };

  addServiceAccident = (ngform: FormGroupDirective) => {
    // console.log(this.addServiceAccidentForm);
    if (this.addServiceAccidentForm.invalid) { return; }

    let formObj: NewServiceAccident = this.addServiceAccidentForm.value;

    let currentService: ServicePolicyAPI = this.getServicePolicyById(Number(formObj.serviceId));
    let {
      Service: { name },
      Supplier: { companyName }
    } = currentService;
    formObj.coverageDays = Number(formObj.coverageDays) || 0;
    formObj = {
      ...formObj,
      //temp fields
      Service: {
        name,
        supplierText: companyName!
      }
    };

    this.servicesAccident.push(formObj);
    this.serviceShowStatusWhenMaintainPolicy();
    this.resetAccidentServiceForm(ngform);
    // console.log(this.addServiceAccidentForm.value);
    // console.log('formObj',formObj);
  };

  serviceShowStatusWhenMaintainPolicy(): void {
    this.servicesPolicies.map((servicePolicy:ServicePolicyAPI): ServicePolicyAPI => {
      let existService = this.servicesAccident.some( (serviceAccident: NewServiceAccident): Boolean =>
        Number(serviceAccident.serviceId) === Number(servicePolicy.serviceId));
      servicePolicy.propertiesUI = { hide: existService };
      return servicePolicy;
    });
  }

  totalCoverageDays(serviceId: number): number {
    let currentServicePolicy = this.getServicePolicyById(Number(serviceId));
    let serviceDefualtDays = Number(currentServicePolicy.Service.coverageDays) || 0;
    let serviceDays = Number(currentServicePolicy.additionalDays) || 0;

    return serviceDefualtDays + serviceDays;
  }

  getServicePolicyById(serviceId: number): ServicePolicyAPI {
    let servicePolicy = this.servicesPolicies.filter(servicePolicy =>
      servicePolicy.serviceId === Number(serviceId));
    console.log('servicePolicy', servicePolicy);
    return servicePolicy.length === 1 ? servicePolicy[0] : {} as ServicePolicyAPI;
  }

  deleteAccidentService(index: number) {
    this.servicesAccident.splice(index, 1);
    this.serviceShowStatusWhenMaintainPolicy();
  }

  searchCar(event: Event) {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('carId')?.value;
      this.selectedCar = this.mouseEventOnSearch(event, this.cars!, controlValue) as CarAPI;
      this.getInsurancePolicies(this.selectedCustomer?.id!, this.selectedCar.id);
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCarText$.next(typeTxt);
    }
  }

  selectInsurancePolicy(event: Event) {
    // console.log('change', event);
    if (event.type === 'change') {
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolicies!, controlValue) as InsurancePolicyAPI;
      // console.log(this.selectedInsurancePolicy);
      this.loadInsurancePolicyServices(this.selectedInsurancePolicy);
      setTimeout(() => {
        this.addServiceAccidentForm.get('supplierId')?.enable();
        this.addServiceAccidentForm.get('serviceId')?.enable();
      }, 0);
      return;
    }
  }

  loadInsurancePolicyServices(insurancePolicy: InsurancePolicyAPI): void {
    this.servicesPolicies = insurancePolicy.ServicePolicies.map(servicePolicy => {
      let newServicePolicy: ServicePolicyAPI = servicePolicy;
      newServicePolicy.propertiesUI = { hide: false };
      return newServicePolicy;
    });

    // console.log('servicesPolicies', this.servicesPolicies)
  }


  searchCustomer(event: Event): void {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      if (this.selectedCustomer) { this.selectedAgent = this.selectedCustomer.Agent; }
      this.formCont('agentId').setValue(this.selectedAgent?.id);
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any):
   UserAPI | CarAPI | InsurancePolicyAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | CarAPI | InsurancePolicyAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  searchCarAPI() {
    let callback = (id: string, val: string) => {
      let query!: SearchCar;
      if (val && val !== '') { query =  { carNumber: val, customerID: id, skipLoadingInterceptor: true }; }
      else { query =  { customerID: id, skipLoadingInterceptor: true }; }
      return this.adminService.CarsAPIs.show(query);
    };
    this.searchTextObj.searchCarText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        // distinctUntilChanged(),
        mergeMap(text => forkJoin([
          of(this.selectedCustomer?.id!),
          of(text)
        ])),
        tap(() => this.spinner.car = true),
        switchMap(([ id, text ]) => callback(id, text))
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


  getRegions(): void {
    this.adminService.GeneralAPIs.regions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data)
          { this.regions = response.data; }
        //  console.log(response);
        },
        error: (err: any) => console.error(err.error)
      });
  }

  getSuppliers(regionId: number) {
    let searchConditions: SearchUser = { role: 'supplier', regionID: regionId };
    this.adminService.UsersAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: UsersAPI) => this.suppliers = response.data,
        error: error => console.log(error)
      });
  }

  getInsurancePolicies(customerId: string, carId: number) {
    this.spinner.insurancePolicy = true;
    this.insurancePolicyNotValidMsg = undefined;
    let searchConditions: SearchInsurancePolicy = {
      customerID: customerId,
      carID: carId,
      filterOutValid: true
    };
    this.adminService.InsurancePoliciesAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            this.insurancePolicies = response.data;
            this.formCont('insurancePolicyId').enable();
          }
          this.spinner.insurancePolicy = false;
        },
        error: (error: any) => {
          if (error.error.message)
          { this.insurancePolicyNotValidMsg = error.error.message; }
          this.spinner.insurancePolicy = false;
          console.log(error);
        }
      });
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }

    setTimeout(() => {
      this.addAccidentForm.get('driverName')?.setValue(this.selectedCustomer?.username);
      this.addAccidentForm.get('driverIdentity')?.setValue(this.selectedCustomer?.identityNum);
      this.addAccidentForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
      this.getSuppliers(Number(this.selectedCustomer?.Region.id));
    }, 0);
    this.searchTextObj.searchCarText$.next('');
  }

  selectAccidentService(event: Event) {
    // console.log(event, event.target)
    let serviceId = ((event.target as HTMLInputElement).value)?.trim();
    if (!Number(serviceId)) { return; }
    this.selectedServicePolicy = this.getServicePolicyById(Number(serviceId));
    this.maxDays = Number(this.selectedServicePolicy.additionalDays) +  Number(this.selectedServicePolicy.Service.coverageDays);
    this.addServiceAccidentForm.get('coverageDays')?.enable();
    this.addServiceAccidentForm.get('coverageDays')?.setValidators(Validators.max(this.maxDays));
    this.addServiceAccidentForm.updateValueAndValidity();
  }

  resetAccidentForm(addAccidentFormDirective: FormGroupDirective) {
    this.addAccidentForm.reset();
    this.addAccidentForm.updateValueAndValidity();
    this.addAccidentForm.markAsUntouched();
    addAccidentFormDirective.resetForm();
    this.selectedCustomer = undefined;
    this.selectedCar = undefined;
    this.selectedAgent = undefined;
    this.selectedRegion = undefined;
    this.selectedInsurancePolicy = undefined;
    this.servicesAccident = [];
    this.formCont('registerAccidentDate').setValue((new Date()).toISOString().substring(0, 10));

    this.resetAccidentServiceFormGene();
  }

  resetAccidentServiceForm(addAccidentServiceFormDirective: FormGroupDirective) {
    this.resetAccidentServiceFormGene();
    addAccidentServiceFormDirective.resetForm();
  }

  resetAccidentServiceFormGene() {
    this.addServiceAccidentForm.reset();
    this.addServiceAccidentForm.updateValueAndValidity();
    this.addServiceAccidentForm.markAsUntouched();
    this.serviceShowStatusWhenMaintainPolicy();
    this.maxDays = 0;
  }

  formCont(controlName: string): any {
    return this.addAccidentForm.controls[controlName];
  }

  formContS(controlName: string): any {
    return this.addServiceAccidentForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean {
    if (event instanceof KeyboardEvent) {
      const code = event.key;
      // console.log(code);
      if (Number.isNaN(+code))
      { if (!this.keys.includes(code.toLowerCase()))
      { return false; } }
    }
    return true;
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCustomer = undefined;
    this.selectedAgent = undefined;
    this.selectedCar = undefined;

    this.formCont('agentId').setValue('');
    this.formCont('customerId').setValue('');

    this.formCont('driverName').setValue('');
    this.formCont('driverIdentity').setValue('');
    this.formCont('insurancePolicyId').setValue('');

    this.formCont('carId').disable();

    this.cancelCarInput(event);
    this.suppliers = [];
  }

  cancelCarInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCar = undefined;
    this.formCont('carId').setValue('');

    this.insurancePolicyNotValidMsg = undefined;
    this.formCont('insurancePolicyId').disable();

    this.cancelInsurancePolicyInput(event);
  }

  cancelInsurancePolicyInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedInsurancePolicy = undefined;
    this.formCont('insurancePolicyId').setValue('');

    this.resetArraysOfData();
    this.resetAccidentServiceFormToEmpty();
  }

  resetArraysOfData() {
    this.servicesPolicies = [];
    this.servicesAccident = [];
  }


  resetAccidentServiceFormToEmpty() {
    this.maxDays = 0;
    this.addServiceAccidentForm.get('coverageDays')?.setValue(null);
    this.addServiceAccidentForm.get('supplierId')?.setValue(null);
    this.addServiceAccidentForm.get('serviceId')?.setValue(null);

    this.addServiceAccidentForm.get('supplierId')?.disable();
    this.addServiceAccidentForm.get('serviceId')?.disable();
    this.addServiceAccidentForm.get('coverageDays')?.disable();
  }

  trackById(_index: number, el: any) {
    return el.id;
  }

  trackByServiceId(_index: number, el: any) {
    return el.serviceId;
  }

}
