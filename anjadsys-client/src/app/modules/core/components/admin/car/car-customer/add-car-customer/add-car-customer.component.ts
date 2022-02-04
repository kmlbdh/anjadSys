import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { CarModelAPI, CarTypeAPI } from '../../../../../model/car';
import { UserAPI } from '../../../../../model/user';
import { RegionAPI } from '../../../../../model/general';

@Component({
  selector: 'app-add-car-customer',
  templateUrl: './add-car-customer.component.html',
  styleUrls: ['./add-car-customer.component.scss']
})
export class AddCarCustomerComponent implements OnInit, OnDestroy {
  [index: string]: any;

  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;

  carTypes!: any[];
  carModels: any[] | undefined;
  customers: any[] | undefined;
  selectedCustomer: UserAPI | undefined;
  selectedCarType: CarTypeAPI | undefined;
  selectedCarModel: CarModelAPI | undefined;

  private unsubscribe$ = new Subject<void>();
  private searchTextObj: {[index: string]: any} = {
    searchCarTypeText$:  new Subject<string>(),
    searchCarModelText$: new Subject<string>(),
    searchCustomerText$: new Subject<string>()
  };

  TIMEOUTMILISEC = 7000;

  addCarForm = this.fb.group({
    carNumber: ['', [Validators.required]],
    motorNumber: ['', Validators.required],
    motorPH: ['', Validators.required],
    licenseType: ['', Validators.required],
    serialNumber: ['', Validators.required],
    passengersCount: ['', Validators.required],
    productionYear: ['', Validators.required],
    note: [''],
    customerId: ['', Validators.required],
    carTypeId: ['', Validators.required],
    carModelId: [{value: '', disabled: true}, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.searchCarTypeAPI();
    this.searchCarModelAPI();
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCar = (ngform: FormGroupDirective) => {
    console.log(this.addCarForm);
    if (this.addCarForm.invalid) return;

    let formObj = this.addCarForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });

   this.adminService.addCar(formObj)
   .pipe(takeUntil(this.unsubscribe$))
   .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        this.resetForm(ngform);
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

      }
    });
    console.log(this.addCarForm.value);
    console.log(formObj);
  }

  searchCarType(event: Event){
    console.log(event);
    this.sharedSearch(event, 'selectedCarType', 'carTypes', 'carTypeId', 'searchCarTypeText$');
  }

  searchCarModel(event: Event){
    console.log(event);
    this.sharedSearch(event, 'selectedCarModel', 'carModels', 'carModelId', 'searchCarModelText$');
  }

  searchCustomer(event: Event){
    console.log(event);
    this.sharedSearch(event, 'selectedCustomer', 'customers', 'customerId', 'searchCustomerText$');
  }

  sharedSearch(event: Event, selected: string, array: string,
    controlName: string, subjectName: string): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      event.preventDefault();
      event.stopPropagation();
      this[selected] = this[array].filter((unit: any) =>
         unit.id == this.formCont(controlName)?.value)[0];
      // this.carTypeName = `${this.selectedCarType?.name}`;
      return;
    }
    // if(this.formCont('carTypeId')?.value === '')
      // this.carTypeName = undefined;

    let carTypeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(carTypeTxt)
      this.searchTextObj[subjectName].next(carTypeTxt)
  }

  searchCarTypeAPI(){
    this.sharedSearchAPI(
      'listCarTypes', 'carTypes', 'searchCarTypeText$', {});
  }

  searchCarModelAPI(){
    this.sharedSearchAPI(
      'listCarModels', 'carModels', 'searchCarModelText$', {carTypeId: this.selectedCarType?.id});
  }

  searchCustomerAPI(){
    this.sharedSearchAPI(
      'showUsers', 'customers', 'searchCustomerText$', {}, 'username');
  }

  sharedSearchAPI(API: any, array: string, subjectName: string, query: any = {},
     searchQuery: string = 'name'): void{
    this.searchTextObj[subjectName].pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => this.adminService[API]({...query, [searchQuery]: text}))
    ).subscribe({
      next: (response: any) =>{
        if(response.data)
          this[array] = response.data;
          console.log(response);
      },
      error: (err: any) => console.log(err)
    })
  }

  resetForm(ngform: FormGroupDirective){
    this.addCarForm.reset();
    this.addCarForm.updateValueAndValidity();
    this.addCarForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any{
    return this.addCarForm.controls[controlName];
  }

  acceptNumbers(event: KeyboardEvent): Boolean | undefined{
    const code = event.key;
    if(Number.isNaN(+code))
      if(code.toLowerCase() !== 'backspace')
        return false;

    return;
  }

  toggleModel(event: Event){
    if(this.formCont('carTypeId').value === ''){
      this.formCont('carModelId').disable();
      this.selectedCarType = undefined;
    }
    else
      this.formCont('carModelId').enable();
  }


}
