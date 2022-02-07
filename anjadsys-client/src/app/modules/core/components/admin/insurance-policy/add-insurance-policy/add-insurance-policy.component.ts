import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, forkJoin, mergeMap, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CarAPI, SearchCar } from 'src/app/modules/core/model/car';
import { ServiceAPI } from 'src/app/modules/core/model/service';
import { SearchUser, UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../admin.service';
import { NewInsurancePolicy } from '../../../../model/insurancepolicy';
import { NewServicePolicy } from '../../../../model/service';

@Component({
  selector: 'app-add-insurance-policy',
  templateUrl: './add-insurance-policy.component.html',
  styleUrls: ['./add-insurance-policy.component.scss']
})
export class AddInsurancePolicyComponent implements OnInit, OnDestroy {
  [index: string]: any;

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  addServiceBtnIcon = faPlus;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  days = 'يوم';
  currency = 'شيكل';

  services!: ServiceAPI[];
  servicesPolicy: NewServicePolicy[] = [];
  cars: CarAPI[] = [];
  agents: UserAPI[] = [];
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

  TIMEOUTMILISEC = 7000;

  addInsurancePolicyForm = this.fb.group({
    totalPrice: ['', [Validators.required]],
    note: [''],
    customerId: ['', Validators.required],
    agentId: ['', Validators.required],
    carId: ['', Validators.required],
  });

  addServicePolicyForm = this.fb.group({
    serviceId: ['', [Validators.required]],
    additionalDays: [{value: '', disabled: true}, Validators.required],
    note: [''],
    cost: [0 , Validators.required],
    supplierId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getServices();

    this.searchCarAPI();
    this.searchCustomerAPI();
    this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addInsurancePolicy = (ngform: FormGroupDirective) => {
    console.log(this.addInsurancePolicyForm);
    if (this.addInsurancePolicyForm.invalid) return;

    let formObj: NewInsurancePolicy = this.addInsurancePolicyForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });
    formObj.services = this.servicesPolicy;
    this.adminService.addInsurancePolicy(formObj)
   .pipe(takeUntil(this.unsubscribe$))
   .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        this.resetInsurancePolicyForm(ngform);
        console.log(response);
      },
      error: (err: any) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

      }
    });
    console.log(formObj);
    console.log(this.addServicePolicyForm.value);
  }

  addServicePolicy = (ngform: FormGroupDirective) => {
    if (this.addServicePolicyForm.invalid) return;

    let formObj = this.addServicePolicyForm.value;

    this.servicesPolicy.push(formObj);
    this.serviceShowStatusWhenMaintainPolicy();
    this.totalCostForAllServices();
    this.resetServicePolicyForm(ngform);
  }

  serviceShowStatusWhenMaintainPolicy(){
    this.services.map((service) => {
      let existService = this.servicesPolicy.some(servicePolicy => {
        console.log(servicePolicy.serviceId);
        return Number(servicePolicy.serviceId) === Number(service.id);
      });
      // console.log(service.id, existService);
      service['propertiesUI'] = {hide: existService};
      return service;
    });
  }

  totalCoverageDays(serviceId: number): number{
    let serviceDefualtDays = Number(this.services.filter(service =>  service.id === Number(serviceId))[0].coverageDays);
    let serviceDays = Number(this.servicesPolicy.filter(service => service.serviceId === serviceId)[0].additionalDays);
    // console.log('totalCoverageDays');
    return serviceDefualtDays + serviceDays;
  }

  serviceText(serviceId: number): string {
    console.log('serviceText');
    return this.services.filter(service =>  service.id === Number(serviceId))[0].name;
  }

  supplierText(supplierId: string): string {
    console.log('supplierText');
    return this.suppliers.filter(supplier =>  supplier.id === supplierId)[0].username;
  }

  deleteServicePolicy(index: number){
    this.servicesPolicy.splice(index, 1);
    this.serviceShowStatusWhenMaintainPolicy();
    this.totalCostForAllServices();
  }

  searchCar(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('carId')?.value;
      this.selectedCar = this.mouseEventOnSearch(event, this.cars!, controlValue) as CarAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.car = true;
      this.searchTextObj.searchCarText$.next(typeTxt);
    }

  }

  searchAgent(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('agentId')?.value;
      this.selectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.agent = true;
      this.searchTextObj.searchAgentText$.next(typeTxt);
    }
  }

  searchCustomer(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      if(this.selectedCustomer) this.selectedAgent = this.selectedCustomer.Agent;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.customer = true;
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }

  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI | CarAPI{
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | CarAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  searchCarAPI(){
    let callback = (id: string, val: string) => {
      let query!: SearchCar;
      if(val && val !== '') query =  { carNumber: val, customerId: id, skipLoadingInterceptor: true}
      else query =  { customerId: id,  skipLoadingInterceptor: true}
      return this.adminService.showCars(query);
    }
    this.searchTextObj.searchCarText$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap(text => forkJoin([
        of(this.selectedCustomer?.id!),
        of(text)
      ])),
      tap(([id, text]) => console.log('meeeeeeeeeeeeeee', id, text)),
      switchMap(([id, text]) => callback(id, text))
    ).subscribe({
      next: (response: any) => {
        if(response.data){
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

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.showUsers(
      { username: val, role: 'customer', agent: true, skipLoadingInterceptor: true } as SearchUser);

      this.searchTextObj.searchCustomerText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
            this.customers = response.data;
          }
          this.spinner.customer = false;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.customer = false;
        }
      });
    // this.sharedSearchAPI('customers', this.searchTextObj.searchCustomerText$, callback);
  }

  searchAgentAPI(){
    let callback = (val: string) => this.adminService.showUsers(
      { username: val, companyName: val, role: "agent", skipLoadingInterceptor: true} as SearchUser);

      this.searchTextObj.searchAgentText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
            this.agents = response.data;
            this.spinner.agent = false;
          }
            console.log(response);
        },
        error: (err: any) => console.log(err)
      });
    // this.sharedSearchAPI('agents', this.searchTextObj.searchAgentText$, callback);
  }

  sharedSearchAPI(array: string, subjectName: Subject<string>, callback: any): void{
    subjectName.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(([id, text]) => callback(id, text))
    ).subscribe({
      next: (response: any) => {
        if(response.data){
          this[array] = response.data;
        }
          console.log(response);
      },
      error: (err: any) => console.log(err)
    })
  }

  getServices(): void{
    this.adminService.listServices()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          response.data.forEach(service => service['propertiesUI'] = {hide: false});
          this.services = response.data;
        }
        console.log(response.data);
      },
      error: err => console.log(err)
    })
  }

  getSuppliers(regionId: number){
    let searchConditions: SearchUser = {role: "supplier", regionID: regionId};
    this.adminService.showUsers(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: UsersAPI) => this.suppliers = response.data,
      error: (error) => console.log(error)
    })
  }

  selectServicePolicy(event: Event){
    console.log(event, event.target)
    let serviceId = ((event.target as HTMLInputElement).value)?.trim()
    this.selectedService = this.services.filter(service => service.id === Number(serviceId) )[0];
    this.addServicePolicyForm.get('additionalDays')?.enable();
  }

  totalCostPerServicePolicy(event: Event){
    // if(!(event instanceof KeyboardEvent)) return;
    let additionalDays = Number((event.target as HTMLInputElement)?.value);
    let cost = Number(this.selectedService?.cost);
    let coverageDays = this.selectedService?.coverageDays;
    // console.log(additionalDays, cost, coverageDays, !(additionalDays >= 0));
    if(!(additionalDays >= 0) || !cost || !coverageDays) return;

    additionalDays = Number(additionalDays.toFixed(2));
    cost = Number(cost.toFixed(2));
    coverageDays = Number(coverageDays.toFixed(2));
    let perDayCost =  Number((cost / coverageDays).toFixed(2));

    let total = cost + (perDayCost * (additionalDays * 0.25));
    // console.log(perDayCost, additionalDays, perDayCost * (additionalDays * 0.25));
    this.addServicePolicyForm.get('cost')?.setValue(total);
  }

  totalCostForAllServices() {
    let total = 0;
    this.servicesPolicy.forEach((service) => {
      total += service.cost;
      // console.log('total',total);
    });
    this.addInsurancePolicyForm.get('totalPrice')?.setValue(total);

  }

  fillFieldsByCustomer(event: Event){
    if(event instanceof KeyboardEvent) return;

    setTimeout(() => {
      this.addInsurancePolicyForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
      this.getSuppliers(Number(this.selectedCustomer?.Region.id))
    }, 0);
    this.searchTextObj.searchCarText$.next('');
  }

  resetInsurancePolicyForm(addInsurancePolicyFormDirective: FormGroupDirective){
    this.addInsurancePolicyForm.reset();
    this.addInsurancePolicyForm.updateValueAndValidity();
    this.addInsurancePolicyForm.markAsUntouched();
    addInsurancePolicyFormDirective.resetForm();
    this.selectedCustomer = undefined;
    this.selectedService = undefined;
    this.selectedCar = undefined;
    this.selectedAgent = undefined;
    this.addServicePolicyForm.reset();
    this.addServicePolicyForm.updateValueAndValidity();
    this.addServicePolicyForm.markAsUntouched();
    this.servicesPolicy = [];
  }

  resetServicePolicyForm(addServicePolicyFormDirective: FormGroupDirective){
    this.addServicePolicyForm.reset();
    this.addServicePolicyForm.updateValueAndValidity();
    this.addServicePolicyForm.markAsUntouched();
    addServicePolicyFormDirective.resetForm();
  }

  formCont(controlName: string): any{
    return this.addInsurancePolicyForm.controls[controlName];
  }

  formContS(controlName: string): any{
    return this.addServicePolicyForm.controls[controlName];
  }

  acceptNumbers(event: KeyboardEvent): Boolean | undefined{
    const code = event.key;
    if(Number.isNaN(+code))
      if(code.toLowerCase() !== 'backspace')
        return false;

    return;
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

  trackById(_index: number, el: any){
    return el.id;
  }

  trackByServiceId(_index: number, el: any){
    return el.serviceId;
  }
}
