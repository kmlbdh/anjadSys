import { updateCar } from './../../../../../model/car';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { CarModelAPI, CarTypeAPI } from 'src/app/modules/core/model/car';
import { UserAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarAPI } from '../../../../../model/car';

@Component({
  selector: 'app-edit-car-customer',
  templateUrl: './edit-car-customer.component.html',
  styleUrls: ['./edit-car-customer.component.scss']
})
export class EditCarCustomerComponent implements OnInit, OnDestroy {
  [index: string]: any;

  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;

  car!: CarAPI;
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
  // rolesAPI!: RoleAPI[];
  // regionsAPI!: RegionAPI[];

  TIMEOUTMILISEC = 7000;

  editCarForm = this.fb.group({
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
    carModelId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getCarData();
    this.searchCarTypeAPI();
    this.searchCarModelAPI();
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateCar = (): void => {
    let formObj: updateCar = {} as updateCar;
    formObj.carId = this.car.id;

    let controlsObject = this.editCarForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.car[val])
            formObj[val] = currValue;
      }
    });

    if(Object.keys(formObj).length < 2){
      this.errorMsg = "يجب اجراء تغيير في المعلومات حتى يتم تحديثها!";
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.updateCar(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if(response.data)
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

          console.log(response);
        },
        error: (err) => {
          console.error(err.error);
          if(err?.error?.message){
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
    });

    console.log(formObj);
  }

  searchCarType(event: Event): void{
    console.log(event);
    this.sharedSearch(event, 'selectedCarType', 'carTypes', 'carTypeId', 'searchCarTypeText$');
  }

  searchCarModel(event: Event): void{
    console.log(event);
    this.sharedSearch(event, 'selectedCarModel', 'carModels', 'carModelId', 'searchCarModelText$');
  }

  searchCustomer(event: Event): void{
    console.log(event);
    this.sharedSearch(event, 'selectedCustomer', 'customers', 'customerId', 'searchCustomerText$');
  }

  sharedSearch(event: Event, selected: string, array: string, controlName: string,
     subjectName: string): void{
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

  searchCarTypeAPI(): void{
    this.sharedSearchAPI(
      'listCarTypes', 'carTypes', 'searchCarTypeText$', {});
  }

  searchCarModelAPI(): void{
    this.sharedSearchAPI(
      'listCarModels', 'carModels', 'searchCarModelText$', {carTypeId: this.selectedCarType?.id});
  }

  searchCustomerAPI(): void{
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

  getCarData(): void{
    this.route.paramMap.subscribe({
      next: params => {
        const carId = params.get('id');
        console.log("carNumber", carId);
        if(!carId)
          this.redirect();

          this.adminService.showCars({carId:  Number(carId!)})
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: response => {
              if(response.data && !response.data.length)
                this.redirect();

              this.car = response.data[0];
              this.buildForm();
            },
            error: err => console.log(err)
          });
      }
    });
  }

  buildForm():void{
    this.editCarForm.setValue({
      carNumber: this.car.carNumber,
      motorNumber: this.car.motorNumber,
      motorPH: this.car.motorPH,
      licenseType: this.car.licenseType,
      serialNumber: this.car.serialNumber,
      passengersCount: this.car.passengersCount,
      productionYear: this.car.productionYear,
      note: this.car.note || '',
      customerId: this.car.User.id,
      carTypeId: this.car.CarType.id,
      carModelId: this.car.CarModel.id,
    });
    this.selectedCustomer =  this.car.User;
    this.selectedCarModel =  this.car.CarModel;
    this.selectedCarType =  this.car.CarType;
  }


  redirect(): void{
    this.router.navigate(['/admin/car/car-customer/show']);
  }

  formCont(controlName: string): any{
    return this.editCarForm.controls[controlName];
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
