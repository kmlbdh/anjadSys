import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, forkJoin, mergeMap, of, Subject, switchMap, takeUntil, tap, Observable, skip } from 'rxjs';
import { CarAPI, SearchCar } from 'src/app/modules/core/model/car';
import { ServiceAPI } from 'src/app/modules/core/model/service';
import { SearchUser, UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InsurancePolicesAPI, InsurancePolicyAPI, updateInsurancePolicy } from '../../../../model/insurancepolicy';
import { updateServicePolicy, ServicePolicyAPI, ServicesAPI, NewServicePolicy } from '../../../../model/service';

@Component({
  selector: 'app-edit-insurance-policy',
  templateUrl: './edit-insurance-policy.component.html',
  styleUrls: ['./edit-insurance-policy.component.scss']
})
export class EditInsurancePolicyComponent implements OnInit {
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
  private keys = ['backspace', 'arrowleft', 'arrowright'];

  TIMEOUTMILISEC = 7000;

  editInsurancePolicyForm = this.fb.group({
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
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPageData();

    this.searchCarAPI();
    this.searchCustomerAPI();
    this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getPageData(){
    this.route.paramMap.subscribe({
      next: params => {
        const insurancePolicyID = params.get('id');
        // console.log("insurancePolicyID", insurancePolicyID);
        if(!insurancePolicyID)
          this.router.navigate(['/admin/insurance-policy/show']);
          this.getData(insurancePolicyID!);
      }
    });
  }

  getData(insurancePolicyID: string){
    // let searchConditions: SearchUser = {role: "supplier", regionID: regionId};
    let insurancePolicy$ = this.adminService.listInsurancePolicy({insurancePolicyId: Number(insurancePolicyID)}) as Observable<InsurancePolicesAPI>;
    let services$ = this.adminService.listServices() as Observable<ServicesAPI>;
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe({
    //   next: response => {
        // if(response.data){
        //   response.data.forEach(service => service['propertiesUI'] = {hide: false});
        //   this.services = response.data;
        // }
    //     console.log(response.data);
    //   },
    //   error: err => console.log(err)
    // })
    // let searchConditions: SearchUser = {role: "supplier", regionID: regionId};
    // this.adminService.showUsers(searchConditions)
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe({
    //   next: (response: UsersAPI) => this.suppliers = response.data,
    //   error: (error) => console.log(error)
    // })
    combineLatest([insurancePolicy$, services$])
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: ([insurancePolicy, services]) => {
        console.log(insurancePolicy.data);
        if(services.data){
          this.services = services.data;
          this.serviceShowStatusWhenMaintainPolicy();
        }
        if(insurancePolicy.data && insurancePolicy.data.length === 1){
          this.insurancePolicy = insurancePolicy.data[0];
          this.servicesPolicy = this.insurancePolicy.ServicePolicies;
          this.selectedCustomer = this.insurancePolicy.Customer;
          this.selectedAgent = this.insurancePolicy.Agent;
          this.selectedCar = this.insurancePolicy.Car;
          this.buildForm();
          this.services.map(service => {
            let found = this.insurancePolicy.ServicePolicies
            .filter(servicePolicy => service.id === servicePolicy.Service.id)[0];
            service['propertiesUI'] = found ? {hide: true} : {hide: false};
            return service;
          });
          this.getSuppliers(Number(this.selectedCustomer?.Region.id));
        }
      }
    });
  }

  buildForm(): void{
    this.editInsurancePolicyForm.setValue({
      totalPrice: this.insurancePolicy.totalPrice,
      note: this.insurancePolicy.note || '',
      customerId: this.insurancePolicy.Customer.id,
      agentId: this.insurancePolicy.Agent.id,
      carId: this.insurancePolicy.Car.id,
    });
  }

  updateInsurancePolicy = (ngform: FormGroupDirective) => {
    if (this.editInsurancePolicyForm.invalid) return;

    let formObj: updateInsurancePolicy = this.editInsurancePolicyForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });

    formObj.insurancePolicyId = this.insurancePolicy.id;
    formObj.services = this.handleServicesPolicyOnSubmit();

    this.adminService.updateInsurancePolicy(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if(response.data){
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
          }
          console.log(response);
        },
        error: (err: any) => {
          console.error(err.error);
          if(err?.error?.message)
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

        },
        complete: () => this.resetServicePolicyForm(ngform)
      });
    console.log(formObj);
    console.log(this.editInsurancePolicyForm.value);
  }

  handleServicesPolicyOnSubmit(): updateServicePolicy[]{
    let servicesPolices: updateServicePolicy[] = [];
    this.servicesPolicy.forEach(servicePolicy => {
      if(servicePolicy.id){
        let { Service, Supplier, createdAt, updatedAt, ...newServicePolicy} = servicePolicy;
        servicesPolices.push(newServicePolicy as updateServicePolicy);
      } else
        servicesPolices.push(servicePolicy as updateServicePolicy);
    });

    return servicesPolices;
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
    console.log('serviceText', serviceId);
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
      else query =  { customerId: id, skipLoadingInterceptor: true}

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
          this.spinner.customer = false;
          console.log(err);
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
          }
          this.spinner.agent = false;
          console.log(response);
        },
        error: (err: any) => {
          this.spinner.agent = false;
          console.log(err);
        }
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
    // this.addServiceAccidentForm.get('cost')?.enable;
  }

  totalCostForAllServices() {
    let total = 0;
    this.servicesPolicy.forEach((service) => {
      total += service.cost;
      // console.log('total',total);
    });
    this.editInsurancePolicyForm.get('totalPrice')?.setValue(total);
    // this.servicesPolicy.forEach(servicePolicy => {
    //   let serviceId: number;
    //   if(servicePolicy.Service?.id)
    //     serviceId = servicePolicy.Service.id
    //   else
    //     serviceId = servicePolicy.serviceId!;

    //   let service = this.services.filter(service => service.id === serviceId)[0];
    //   const perDayCost = Number(service.coverageDays.toFixed(2))/ Number(service.cost.toFixed(2));
    //   const additionalDays = Number(servicePolicy.additionalDays);
    //   const cost = Number(servicePolicy.Service.cost.toFixed(2));
    //   total = cost + (perDayCost * (additionalDays * 0.25));
    //   this.addServicePolicyForm.get('totalPrice')?.setValue(total);
    // });
  }

  fillFieldsByCustomer(event: Event){
    if(event instanceof KeyboardEvent) return;
    setTimeout(() => {
      this.editInsurancePolicyForm.get('agentId')?.setValue(this.selectedCustomer?.Agent?.id);
      this.getSuppliers(Number(this.selectedCustomer?.Region.id));
    }, 0);
    this.searchTextObj.searchCarText$.next('');
  }

  resetServicePolicyForm(addServicePolicyFormDirective: FormGroupDirective){
    this.addServicePolicyForm.reset();
    this.addServicePolicyForm.updateValueAndValidity();
    this.addServicePolicyForm.markAsUntouched();
    addServicePolicyFormDirective.resetForm();
  }

  formCont(controlName: string): any{
    return this.editInsurancePolicyForm.controls[controlName];
  }

  formContS(controlName: string): any{
    return this.addServicePolicyForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean{
    if(event instanceof KeyboardEvent){
      const code = event.key;
      console.log(code);
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
