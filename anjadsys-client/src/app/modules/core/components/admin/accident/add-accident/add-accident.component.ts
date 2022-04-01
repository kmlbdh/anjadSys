import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, forkJoin, of, Subject, switchMap, takeUntil, mergeMap, tap, filter } from 'rxjs';
import { CarAPI } from 'src/app/modules/core/model/car';
import { RegionAPI } from 'src/app/modules/core/model/general';
import { UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../admin.service';
import { SearchUser } from '../../../../model/user';
import { SearchCar } from '../../../../model/car';
import { NewServiceAccident, ServiceAPI } from '../../../../model/service';
import { NewAccident } from '../../../../model/accident';
import { InsurancePolicyAPI, SearchInsurancePolicy, InsurancePolicesAPI } from '../../../../model/insurancepolicy';

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
  days = 'يوم';
  currency = 'شيكل';

  services!: ServiceAPI[];
  servicesAccident: NewServiceAccident[] = [];
  insurancePolices: InsurancePolicyAPI[] = [];
  cars: CarAPI[] = [];
  agents: UserAPI[] = [];
  customers: UserAPI[] = [];
  suppliers: UserAPI[] = [];
  regions: RegionAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedAgent: UserAPI | undefined | null;
  selectedRegion: RegionAPI | undefined;
  selectedCar: CarAPI | undefined;
  selectedService: ServiceAPI | undefined;
  selectedInsurancePolicy: InsurancePolicyAPI | undefined;

  firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
  lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

  spinner = {
    customer: false,
    agent: false,
    car: false,
    supplier: false,
    insurancePolicy: false,
  };

  private keys = ['backspace', 'arrowleft', 'arrowright'];
  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCarText$:  new Subject<string>(),
    searchRegionText$: new Subject<string>(),
    searchCustomerText$: new Subject<string>(),
    searchAgentText$: new Subject<string>()
  };

  TIMEOUTMILISEC = 7000;

  addAccidentForm = this.fb.group({
    name: ['', [Validators.required]],
    accidentPlace: ['', Validators.required],
    accidentDate: ['', Validators.required],
    registerAccidentDate: [(new Date()).toISOString().substring(0,10), Validators.required],
    driverName: ['', Validators.required],
    driverIdentity: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')]],
    accidentDescription: ['', Validators.required],
    expectedCost: ['', Validators.required],
    note: [''],
    regionId: ['', Validators.required],
    customerId: ['', Validators.required],
    agentId: ['', Validators.required],
    carId: ['', Validators.required],
    insurancePolicyId: ['', Validators.required],
  });

  addServiceAccidentForm = this.fb.group({
    serviceId: ['', [Validators.required]],
    additionalDays: [{value: '', disabled: true}, Validators.required],
    note: [''],
    cost: [0, Validators.required],
    supplierPercentage: ['', Validators.required],
    supplierId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getRegions();
    // this.getServices();

    this.searchCarAPI();
    this.searchCustomerAPI();
    this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addAccident = (ngform: FormGroupDirective) => {
    // console.log(this.addAccidentForm);
    if (this.addAccidentForm.invalid) return;

    let formObj: NewAccident = this.addAccidentForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });
    formObj.services = this.servicesAccident;
    delete formObj['insurancePolicyId'];
    this.adminService.addAccident(formObj)
   .pipe(takeUntil(this.unsubscribe$))
   .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        this.resetAccientForm(ngform);
        // console.log(response);
      },
      error: (err: any) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

      }
    });
    // console.log(this.addAccidentForm.value);
    // console.log(formObj);
  }

  addServiceAccident = (ngform: FormGroupDirective) => {
    // console.log(this.addServiceAccidentForm);
    if (this.addServiceAccidentForm.invalid) return;

    let formObj: NewServiceAccident = this.addServiceAccidentForm.value;

    this.servicesAccident.push(formObj);
    this.serviceShowStatusWhenMaintainPolicy();
    this.resetAccidentServiceForm(ngform);
    // console.log(this.addServiceAccidentForm.value);
    // console.log(formObj);
  }

  serviceShowStatusWhenMaintainPolicy(){
    this.services.map((service) => {
      let existService = this.servicesAccident.some(serviceAccident => {
        // console.log(serviceAccident.serviceId);
        return Number(serviceAccident.serviceId) === Number(service.id);
      });
      // console.log(service.id, existService);
      service['propertiesUI'] = {hide: existService};
      return service;
    });
  }

  totalCoverageDays(serviceId: number): number{
    let serviceDefualtDays = Number(this.services.filter(service =>  service.id === Number(serviceId))[0].coverageDays);
    let serviceDays = Number(this.servicesAccident.filter(service => service.serviceId === serviceId)[0].additionalDays);
    // console.log('totalCoverageDays');
    return serviceDefualtDays + serviceDays;
  }

  serviceText(serviceId: number): string {
    // console.log('serviceText')
    return this.services.filter(service =>  service.id === Number(serviceId))[0].name;
  }

  supplierText(supplierId: string): string {
    // console.log('supplierText')
    return this.suppliers.filter(supplier =>  supplier.id === supplierId)[0].username;
  }

  deleteAccidentService(index: number){
    const _arr = this.servicesAccident.splice(index, 1);
    this.serviceShowStatusWhenMaintainPolicy();
  }

  searchCar(event: Event){
    // console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('carId')?.value;
      this.selectedCar = this.mouseEventOnSearch(event, this.cars!, controlValue) as CarAPI;
      this.getInsurancePolices(this.selectedCustomer?.id!, this.selectedCar.id);
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.searchTextObj.searchCarText$.next(typeTxt);
    }
  }

  selectInsurancePolicy(event: Event){
    console.log('change', event);
    if(event.type === 'change'){
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolices!, controlValue) as InsurancePolicyAPI;
      console.log(this.selectedInsurancePolicy);
      this.loadInsurancePolicyServices(this.selectedInsurancePolicy);
      return;
    }
  }

  loadInsurancePolicyServices(insurancePolicy: InsurancePolicyAPI): void {
    this.services = insurancePolicy.ServicePolicies.map(servicePolicy => {
      let service = servicePolicy.Service;
      service['propertiesUI'] = {hide: false};
      return service;
    });
  }

  searchAgent(event: Event){
    // console.log(event);
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
    // console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      if(this.selectedCustomer) this.selectedAgent = this.selectedCustomer.Agent;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
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

  searchCarAPI(){
    let callback = (id: string, val: string) => {
      let query!: SearchCar;
      if(val && val !== '') query =  { carNumber: val, customerID: id, skipLoadingInterceptor: true}
      else query =  { customerID: id, skipLoadingInterceptor: true}
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
      tap(() => this.spinner.car = true),
      switchMap(([id, text]) => callback(id, text))
    ).subscribe({
      next: (response: any) => {
        if(response.data){
          this.cars = response.data;
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

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.showUsers(
      { username: val, role: 'customer', agent: true, skipLoadingInterceptor: true } as SearchUser);
      this.searchTextObj.searchCustomerText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinner.customer = true),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
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

  searchAgentAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
      { username: val, companyName: val, role: "agent", skipLoadingInterceptor: true } as SearchUser);

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
          }
          this.spinner.agent = false;
          // console.log(response);
        },
        error: (err: any) => {
          this.spinner.agent = false;
          console.log(err);
        }
      });
  }

  getRegions(): void {
    this.adminService.listRegions()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
       next: (response) => {
         if(response.data)
          this.regions = response.data;
        //  console.log(response);
       },
       error: (err: any) => console.error(err.error)
     });
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
        // console.log(response.data);
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

  getInsurancePolices(customerId: string, carId: number){
    this.spinner.insurancePolicy = true;
    let searchConditions: SearchInsurancePolicy = { customerID: customerId, carID: carId}
    this.adminService.listInsurancePolicy(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: InsurancePolicesAPI) => {
        if(response.data){
          this.insurancePolices = response.data;
        }
        this.spinner.insurancePolicy = false;
      },
      error: (error: any) => {
        this.spinner.insurancePolicy = false;
        console.log(error);
      }
    });
  }

  selectAccidentService(event: Event){
    // console.log(event, event.target)
    let serviceId = ((event.target as HTMLInputElement).value)?.trim()
    this.selectedService = this.services.filter(service => service.id === Number(serviceId) )[0];
    this.addServiceAccidentForm.get('additionalDays')?.enable();
    this.formContS('supplierPercentage').setValue(this.selectedService.supplierPercentage);
  }

  calculateTotalCost(event: Event){
    // if(!(event instanceof KeyboardEvent)) return;
    let additionalDays = Number((event.target as HTMLInputElement)?.value);
    let cost = Number(this.selectedService?.cost);
    let coverageDays = this.selectedService?.coverageDays;
    if(!(additionalDays >= 0) || !cost || !coverageDays) return;

    additionalDays = Number(additionalDays.toFixed(2));
    cost = Number(cost.toFixed(2));
    coverageDays = Number(coverageDays.toFixed(2));
    let perDayCost =  Number((cost / coverageDays).toFixed(2));

    let total = cost + (perDayCost * (additionalDays * 0.25));
    this.addServiceAccidentForm.get('cost')?.setValue(total);
    // this.addServiceAccidentForm.get('cost')?.enable;
  }

  fillFieldsByCustomer(event: Event){
    if(event instanceof KeyboardEvent) return;

    setTimeout(() => {
      this.addAccidentForm.get('driverName')?.setValue(this.selectedCustomer?.username);
      this.addAccidentForm.get('driverIdentity')?.setValue(this.selectedCustomer?.identityNum);
      this.addAccidentForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
      this.getSuppliers(Number(this.selectedCustomer?.Region.id))
    }, 0);
    this.searchTextObj.searchCarText$.next('');
  }

  resetAccientForm(addAccidentFormDirective: FormGroupDirective){
    this.addAccidentForm.reset();
    this.addAccidentForm.updateValueAndValidity();
    this.addAccidentForm.markAsUntouched();
    addAccidentFormDirective.resetForm();
    this.selectedCustomer = undefined;
    this.selectedService = undefined;
    this.selectedCar = undefined;
    this.selectedAgent = undefined;
    this.selectedRegion = undefined;
    this.addServiceAccidentForm.reset();
    this.addServiceAccidentForm.updateValueAndValidity();
    this.addServiceAccidentForm.markAsUntouched();
    this.servicesAccident = [];
    this.serviceShowStatusWhenMaintainPolicy();
    this.formCont('registerAccidentDate').setValue((new Date()).toISOString().substring(0,10));
  }

  resetAccidentServiceForm(addAccidentServiceFormDirective: FormGroupDirective){
    this.addServiceAccidentForm.reset();
    this.addServiceAccidentForm.updateValueAndValidity();
    this.addServiceAccidentForm.markAsUntouched();
    addAccidentServiceFormDirective.resetForm();
    this.serviceShowStatusWhenMaintainPolicy();
  }

  formCont(controlName: string): any{
    return this.addAccidentForm.controls[controlName];
  }

  formContS(controlName: string): any{
    return this.addServiceAccidentForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean{
    if(event instanceof KeyboardEvent){
      const code = event.key;
      // console.log(code);
      if(Number.isNaN(+code))
        if(!this.keys.includes(code.toLowerCase()))
          return false;
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

    this.cancelCarInput(event);

    this.formCont('driverName').setValue('');
    this.formCont('driverIdentity').setValue('');
    this.formCont('insurancePolicyId').setValue('');
  }

  cancelCarInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCar = undefined;
    this.formCont('carId').setValue('');

    this.cancelInsurancePolicyInput(event);
  }

  cancelInsurancePolicyInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedInsurancePolicy = undefined;
    this.formCont('insurancePolicyId').setValue('');
  }

  trackById(_index: number, el: any){
    return el.id;
  }

  trackByServiceId(_index: number, el: any){
    return el.serviceId;
  }

}
