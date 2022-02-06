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

@Component({
  selector: 'app-add-accident',
  templateUrl: './add-accident.component.html',
  styleUrls: ['./add-accident.component.scss']
})
export class AddAccidentComponent implements OnInit, OnDestroy {
  [index: string]: any;

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  addServiceBtnIcon = faPlus;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  days = 'يوم';
  currency = 'شيكل';

  services!: ServiceAPI[];
  servicesAccident: NewServiceAccident[] = [];
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
    registerAccidentDate: ['', Validators.required],
    driverName: ['', Validators.required],
    driverIdentity: ['', Validators.required],
    accidentDescription: ['', Validators.required],
    expectedCost: ['', Validators.required],
    note: [''],
    regionId: ['', Validators.required],
    customerId: ['', Validators.required],
    agentId: ['', Validators.required],
    carId: ['', Validators.required],
  });

  addServiceAccidentForm = this.fb.group({
    serviceId: ['', [Validators.required]],
    additionalDays: [{value: '', disabled: true}, Validators.required],
    note: [''],
    cost: [0, Validators.required],
    supplierId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getRegions();
    this.getServices();

    this.searchCarAPI();
    this.searchCustomerAPI();
    this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addAccident = (ngform: FormGroupDirective) => {
    console.log(this.addAccidentForm);
    if (this.addAccidentForm.invalid) return;

    let formObj: NewAccident = this.addAccidentForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });
    formObj.services = this.servicesAccident;
    this.adminService.addAccident(formObj)
   .pipe(takeUntil(this.unsubscribe$))
   .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        this.resetAccientForm(ngform);
        console.log(response);
      },
      error: (err: any) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

      }
    });
    console.log(this.addAccidentForm.value);
    console.log(formObj);
  }

  addServiceAccident = (ngform: FormGroupDirective) => {
    console.log(this.addServiceAccidentForm);
    if (this.addServiceAccidentForm.invalid) return;

    let formObj: NewServiceAccident = this.addServiceAccidentForm.value;

    this.servicesAccident.push(formObj);
    this.services.map((service) => {
      service.propertiesUI!.hide = (service.id == this.addServiceAccidentForm.get('serviceId')?.value);
      return service;
    });
    this.resetAccidentServiceForm(ngform);
    console.log(this.addServiceAccidentForm.value);
    console.log(formObj);
  }

  totalCoverageDays(serviceId: number): number{
    let serviceDefualtDays = Number(this.services.filter(service =>  service.id === Number(serviceId))[0].coverageDays);
    let serviceDays = Number(this.servicesAccident.filter(service => service.serviceId === serviceId)[0].additionalDays);
    console.log('totalCoverageDays');
    return serviceDefualtDays + serviceDays;
  }

  serviceText(serviceId: number): string {
    console.log('serviceText')
    return this.services.filter(service =>  service.id === Number(serviceId))[0].name;
  }

  supplierText(supplierId: string): string {
    console.log('supplierText')
    return this.suppliers.filter(supplier =>  supplier.id === supplierId)[0].username;
  }

  deleteAccidentService(index: number){
    this.servicesAccident.splice(index, 1);
  }

  searchCar(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('carId')?.value;
      this.selectedCar = this.mouseEventOnSearch(event, this.cars!, controlValue) as CarAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== '')
      this.searchTextObj.searchCarText$.next(typeTxt);
  }

  searchAgent(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('agentId')?.value;
      this.selectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== '')
      this.searchTextObj.searchAgentText$.next(typeTxt);
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
    if(typeTxt && typeTxt !== '')
      this.searchTextObj.searchCustomerText$.next(typeTxt);
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
      if(val && val !== '') query =  { carNumber: val, customerId: id}
      else query =  { customerId: id}
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
          console.log(response);
      },
      error: (err: any) => console.log(err)
    });
    // this.sharedSearchAPI('cars', this.searchTextObj.searchCarText$,  callback);
  }

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.showUsers(
      { username: val, role: 'customer', agent: true } as SearchUser);
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
            console.log(response);
        },
        error: (err: any) => console.log(err)
      });
    // this.sharedSearchAPI('customers', this.searchTextObj.searchCustomerText$, callback);
  }

  searchAgentAPI(){
    let callback = (val: string) => this.adminService.showUsers(
      { username: val, companyName: val, role: "agent" } as SearchUser);

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

  getRegions(): void {
    this.adminService.listRegions()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
       next: (response) => {
         if(response.data)
          this.regions = response.data;
         console.log(response);
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

  selectAccidentService(event: Event){
    console.log(event, event.target)
    let serviceId = ((event.target as HTMLInputElement).value)?.trim()
    this.selectedService = this.services.filter(service => service.id === Number(serviceId) )[0];
    this.addServiceAccidentForm.get('additionalDays')?.enable();
  }

  calculateTotalCost(event: Event){
    // if(!(event instanceof KeyboardEvent)) return;
    let additionalDays = Number((event.target as HTMLInputElement)?.value);
    let cost = Number(this.selectedService?.cost);
    let coverageDays = this.selectedService?.coverageDays;
    console.log(additionalDays, cost, coverageDays, !(additionalDays >= 0));
    if(!(additionalDays >= 0) || !cost || !coverageDays) return;

    additionalDays = Number(additionalDays.toFixed(2));
    cost = Number(cost.toFixed(2));
    coverageDays = Number(coverageDays.toFixed(2));
    let perDayCost =  Number((cost / coverageDays).toFixed(2));

    let total = cost + (perDayCost * (additionalDays * 0.25));
    console.log(perDayCost, additionalDays, perDayCost * (additionalDays * 0.25));
    this.addServiceAccidentForm.get('cost')?.setValue(total);
    // this.addServiceAccidentForm.get('cost')?.enable;
  }

  fillFieldsByCustomer(event: Event){
    console.log('fillFieldsByCustomer Enter 1');
    if(event instanceof KeyboardEvent) return;
    console.log('fillFieldsByCustomer Enter 2');

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
  }

  resetAccidentServiceForm(addAccidentServiceFormDirective: FormGroupDirective){
    this.addServiceAccidentForm.reset();
    this.addServiceAccidentForm.updateValueAndValidity();
    this.addServiceAccidentForm.markAsUntouched();
    addAccidentServiceFormDirective.resetForm();
  }

  formCont(controlName: string): any{
    return this.addAccidentForm.controls[controlName];
  }

  formContS(controlName: string): any{
    return this.addServiceAccidentForm.controls[controlName];
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
    this.formCont('driverName').setValue('');
    this.formCont('driverIdentity').setValue('');
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
