import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CarAPI, CarsAPI, SearchCar } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchUser, UserAPI } from 'src/app/modules/core/model/user';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-show-car-customer',
  templateUrl: './show-car-customer.component.html',
  styleUrls: ['./show-car-customer.component.scss']
})
export class ShowCarCustomerComponent implements OnInit, OnDestroy {
  cars: CarAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  trashIcon = faTrashAlt;
  carEditIcon = faEdit;
  cancelInput = faTimes;

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    customer: false,
  };

  private searchCustomerText$ = new Subject<string>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCar = {};

  searchCarForm = this.fb.group({
    customerID: [''],
    carNumber: [''],
    serialNumber: [''],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCars(this.searchConditions);
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
      { username: val, skipLoadingInterceptor: true } as SearchUser);

      this.searchCustomerText$.pipe(
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
  }

  searchCustomer(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('customerID')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      this.searchCarForm.get('agentID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.customer = true;
      this.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI{
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerID').setValue('');
  }

  searchCar(form: FormGroupDirective){
    if(form.invalid) return;
    let keys = Object.keys(form.value);
    let searchConditions: SearchCar = {} as SearchCar;
    keys.forEach(key => {
      searchConditions[key] = this.searchCarForm.get(key)?.value;
      if(!searchConditions[key] || searchConditions[key] === '')
        delete searchConditions[key];
    });
    console.log('searchConditions', searchConditions);
    this.getCars(searchConditions);
  }

  getCars(searchConditions: SearchCar){
    this.adminService.showCars(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarsAPI) => {
        if(response.data){
          this.cars = response.data;
          this.pagination.total = response.total;
        }
      },
      error: (error: any) => console.log(error)
    });
  }

  deleteCar(car: any){
    if(!car) return;

    const yes = confirm(`هل تريد حذف السيارة رقم ${car.carNumber} للزبون ${car.User.username}`);
    if(!yes) return;

    this.adminService.deleteCar(car.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getCars(this.searchConditions);
        console.log(response);
      },
      error: err => console.log(err)
    })
  }

  goToCarEdit(id: number){
    this.router.navigate(['admin/car/car-customer/edit', id]);
  }

  formCont(controlName: string){
    return this.searchCarForm.controls[controlName];
  }

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchCar;
    this.p = pageNumber;
    this.getCars(this.searchConditions);
    console.log(pageNumber);
  }
}
