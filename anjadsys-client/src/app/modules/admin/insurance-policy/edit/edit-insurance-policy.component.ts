import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  switchMap,
  takeUntil,
  tap,
  map
} from 'rxjs';
import { CarAPI, SearchCar } from '@models/car';
import { ServiceAPI } from '@models/service';
import { SearchUser, UserAPI, UsersAPI } from '@models/user';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  InsurancePolicesAPI,
  InsurancePolicyAPI,
  updateInsurancePolicy
} from '@models/insurancepolicy';
import { updateServicePolicy, ServicePolicyAPI, ServicesAPI } from '@models/service';

@Component({
  selector: 'app-edit-insurance-policy',
  templateUrl: './edit-insurance-policy.component.html',
  styleUrls: ['./edit-insurance-policy.component.scss']
})
export class EditInsurancePolicyComponent implements OnInit, OnDestroy {

  [index: string]: any;

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  addServiceBtnIcon = faPlus;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  days = 'يوم';
  currency = 'شيكل';

  services!: ServiceAPI[];
  insurancePolicy!: InsurancePolicyAPI;
  servicesPolicy: ServicePolicyAPI[] = [];
  cars: CarAPI[] = [];
  customers: UserAPI[] = [];
  suppliers: UserAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedAgent: UserAPI | undefined | null;
  selectedCar: CarAPI | undefined;
  selectedService: ServiceAPI | undefined;

  spinner = {
    customer: false,
    agent: false,
    car: false,
    supplier: false,
  };

  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCarText$:  new Subject<string>(),
    searchCustomerText$: new Subject<string>(),
    searchAgentText$: new Subject<string>()
  };
  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];

  TIMEOUTMILISEC = 7000;

  editInsurancePolicyForm = this.fb.group({
    totalPrice: [ '', Validators.required ],
    expireDate: [ '', Validators.required ],
    note: [''],
    customerId: [ '', Validators.required ],
    agentId: [ '', Validators.required ],
    carId: [ '', Validators.required ],
  });

  addServicePolicyForm = this.fb.group({
    serviceId: [ '', Validators.required ],
    additionalDays: [ { value: '', disabled: true }, Validators.required ],
    note: [''],
    cost: [ 0, Validators.required ],
    supplierId: [ '', Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPageData();

    this.searchCarAPI();
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPageData() {
    this.route.paramMap.subscribe({
      next: params => {
        const insurancePolicyID = params.get('id');
        // console.log("insurancePolicyID", insurancePolicyID);
        if (!insurancePolicyID) { this.router.navigate(['/admin/insurance-policy/show']); }
        this.getData(insurancePolicyID!);
      }
    });
  }

  getData(insurancePolicyID: string) {
    this.adminService.InsurancePoliciesAPIs.list({ insurancePolicyId: Number(insurancePolicyID) })
      .pipe(
        map( (res: InsurancePolicesAPI) => {
          if (!res.data || !res.data.length) { throw new Error('no data'); }
          this.insurancePolicy = res.data[0];
          this.servicesPolicy = this.insurancePolicy.ServicePolicies;
          this.selectedCustomer = this.insurancePolicy.Customer;
          this.selectedAgent = this.insurancePolicy.Agent;
          this.selectedCar = this.insurancePolicy.Car;
          return res;
        }),
        switchMap( (insurancePolicy: InsurancePolicesAPI) => {
          const packageType = insurancePolicy.data[0].Agent.servicesPackage;
          return this.adminService.ServicesAPIs.list({ packageType });
        })
      )
      .subscribe({
        next: (result: ServicesAPI) => {
          if (result.data && result.data.length) {
            this.services = result.data;
            this.serviceShowStatusWhenMaintainPolicy();
            this.totalCoverageDays();
            this.buildForm();
            this.getSuppliers(Number(this.selectedCustomer?.Region.id));
          }
        },
        error: error => console.log(error)
      });
  }

  buildForm(): void {
    this.editInsurancePolicyForm.setValue({
      totalPrice: this.insurancePolicy.totalPrice,
      expireDate: this.insurancePolicy.expireDate,
      note: this.insurancePolicy.note || '',
      customerId: this.insurancePolicy.Customer.id,
      agentId: this.insurancePolicy.Agent.id,
      carId: this.insurancePolicy.Car.id,
    });
  }

  updateInsurancePolicy = (ngform: FormGroupDirective) => {
    if (this.editInsurancePolicyForm.invalid) { return; }

    let formObj: updateInsurancePolicy = this.editInsurancePolicyForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });

    const insurancePolicyId = this.insurancePolicy.id;
    formObj.services = this.handleServicesPolicyOnSubmit();

    this.adminService.InsurancePoliciesAPIs.update(insurancePolicyId, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
          }
          console.log(response);
        },
        error: (err: any) => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        },
        complete: () => this.resetServicePolicyForm(ngform)
      });
    console.log(formObj);
    console.log(this.editInsurancePolicyForm.value);
  };

  handleServicesPolicyOnSubmit(): updateServicePolicy[] {
    let servicesPolicies: updateServicePolicy[] = [];
    this.servicesPolicy.forEach(servicePolicy => {
      if (servicePolicy.id) {
        //TODO unsed variables need to be removed and enhance the destructuring
        let { Service, Supplier, createdAt, updatedAt, ...newServicePolicy } = servicePolicy;
        delete newServicePolicy['totalCoverageDaysWithAdditional'];
        delete newServicePolicy['supplierText'];
        delete newServicePolicy['serviceText'];
        servicesPolicies.push(newServicePolicy as updateServicePolicy);
      } else {
        let newServicePolicy = { ...servicePolicy };
        delete newServicePolicy['totalCoverageDaysWithAdditional'];
        delete newServicePolicy['supplierText'];
        delete newServicePolicy['serviceText'];
        servicesPolicies.push(newServicePolicy as updateServicePolicy);
      }
    });

    return servicesPolicies;
  }

  addServicePolicy = (ngform: FormGroupDirective) => {
    if (this.addServicePolicyForm.invalid) { return; }

    let formObj: ServicePolicyAPI = this.addServicePolicyForm.value;
    let currentService = this.services.filter(service => service.id == formObj.serviceId)[0];
    formObj.supplierPercentage = currentService.supplierPercentage;
    if (!formObj.additionalDays) { formObj.additionalDays = 0; }
    formObj['totalCoverageDaysWithAdditional'] =  Number(formObj.additionalDays) + Number(currentService.coverageDays);
    formObj['supplierText'] = this.suppliers.filter(supp => supp.id === formObj.supplierId)[0].companyName;
    formObj['serviceText'] = currentService.name;

    this.servicesPolicy.push(formObj);
    this.serviceShowStatusWhenMaintainPolicy();
    this.totalCostForAllServices();
    this.resetServicePolicyForm(ngform);
  };

  serviceShowStatusWhenMaintainPolicy() {
    this.services.map(service => {
      let existService = this.servicesPolicy.some(servicePolicy => {
        console.log(servicePolicy.serviceId);
        return Number(servicePolicy.serviceId) === Number(service.id);
      });
      // console.log(service.id, existService);
      service['propertiesUI'] = { hide: existService };
      return service;
    });
  }

  totalCoverageDays(): void {
    if (!this.services || !this.servicesPolicy) { return; }
    this.servicesPolicy.map( (servicePolicy: ServicePolicyAPI) => {
      this.services.forEach((service: ServiceAPI) => {
        if (Number(service.id) === Number(servicePolicy.Service.id)) {
          servicePolicy['totalCoverageDaysWithAdditional'] = Number(service.coverageDays) + Number(servicePolicy.additionalDays);
        }
      });
      return servicePolicy;
    });
    console.log('done 1 time');
  }

  deleteServicePolicy(index: number) {
    this.servicesPolicy.splice(index, 1);
    this.serviceShowStatusWhenMaintainPolicy();
    this.totalCostForAllServices();
  }

  searchCar(event: Event) {
    console.log(event);
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

  searchCustomer(event: Event): void {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      if (this.selectedCustomer) { this.selectedAgent = this.selectedCustomer.Agent; }
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.spinner.customer = true;
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI | CarAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | CarAPI;
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
        distinctUntilChanged(),
        tap(() => this.spinner.car = true),
        switchMap(text => callback(this.selectedCustomer?.id!, text))
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.cars = response.data;
          }
          this.spinner.car = false;
          console.log(response);
        },
        error: (err: any) => {
          this.spinner.car = false;
          console.log(err);
        }
      });
    // this.sharedSearchAPI('cars', this.searchTextObj.searchCarText$,  callback);
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
        switchMap(callback)
      ).subscribe({
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
    // this.sharedSearchAPI('customers', this.searchTextObj.searchCustomerText$, callback);
  }


  sharedSearchAPI(array: string, subjectName: Subject<string>, callback: any): void {
    subjectName
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(([ id, text ]) => callback(id, text))
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this[array] = response.data;
          }
          console.log(response);
        },
        error: (err: any) => console.log(err)
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

  selectServicePolicy(event: Event) {
    console.log(event, event.target);
    let serviceId = ((event.target as HTMLInputElement).value)?.trim();
    this.selectedService = this.services.filter(service => service.id === Number(serviceId) )[0];
    if (this.selectedService.coverageDays != 0)
    { this.addServicePolicyForm.get('additionalDays')?.enable(); }
    else {
      this.addServicePolicyForm.get('additionalDays')?.setValue(0);
      this.sharedTotalCostPerServicePolicy(0);
    }
  }

  totalCostPerServicePolicy(event: Event) {
    // if(!(event instanceof KeyboardEvent)) return;
    let additionalDays = Number((event.target as HTMLInputElement)?.value);
    this.sharedTotalCostPerServicePolicy(additionalDays);
  }

  sharedTotalCostPerServicePolicy(additionalDays: number) {
    let cost = Number(this.selectedService?.cost);
    let coverageDays = this.selectedService?.coverageDays;

    if (!(additionalDays >= 0) || cost == null || coverageDays == null) { return; }
    let perDayCost = 0;

    additionalDays = Number(additionalDays.toFixed(2));
    cost = Number(cost.toFixed(2));
    coverageDays = Number(coverageDays.toFixed(2));
    perDayCost = coverageDays === 0 ? 1 : Number((cost / coverageDays).toFixed(2));

    let total = Math.round(cost + (perDayCost * (additionalDays * 0.25)));
    // console.log(perDayCost, additionalDays, perDayCost * (additionalDays * 0.25));
    this.addServicePolicyForm.get('cost')?.setValue(total);
  }

  totalCostForAllServices() {
    let total = this.servicesPolicy.reduce((sum, service) => sum += service.cost, 0);
    this.editInsurancePolicyForm.get('totalPrice')?.setValue(total);
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }
    setTimeout(() => {
      this.editInsurancePolicyForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
      this.getSuppliers(Number(this.selectedCustomer?.Region.id));
    }, 0);
    this.searchTextObj.searchCarText$.next('');
  }

  resetServicePolicyForm(addServicePolicyFormDirective: FormGroupDirective) {
    this.addServicePolicyForm.reset();
    this.addServicePolicyForm.updateValueAndValidity();
    this.addServicePolicyForm.markAsUntouched();
    addServicePolicyFormDirective.resetForm();
  }

  formCont(controlName: string): any {
    return this.editInsurancePolicyForm.controls[controlName];
  }

  formContS(controlName: string): any {
    return this.addServicePolicyForm.controls[controlName];
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

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCustomer = undefined;
    this.selectedAgent = undefined;
    this.selectedCar = undefined;

    this.formCont('carId').setValue('');
    this.formCont('agentId').setValue('');
    this.formCont('customerId').setValue('');
  }

  cancelCarInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.selectedCar = undefined;
    this.formCont('carId').setValue('');
  }

  trackById(_index: number, el: any) {
    return el.id;
  }

  trackByServiceId(_index: number, el: any) {
    return el.serviceId;
  }

}
