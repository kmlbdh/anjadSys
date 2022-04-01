import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { CarsAPI, updateCar } from './../../../../../model/car';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CarModelAPI, CarTypeAPI } from 'src/app/modules/core/model/car';
import { UserAPI } from 'src/app/modules/core/model/user';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarAPI, CarTypeArrayAPI } from '../../../../../model/car';

@Component({
  selector: 'app-edit-car-customer',
  templateUrl: './edit-car-customer.component.html',
  styleUrls: ['./edit-car-customer.component.scss']
})
export class EditCarCustomerComponent implements OnInit, OnDestroy {
  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;

  car!: CarAPI;
  carTypes!: any[];
  carModels: any[] | undefined;
  customers: any[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedCarType: CarTypeAPI | undefined;
  selectedCarModel: CarModelAPI | undefined;
  selectedCarTypeId: number | undefined;

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
    carType: false,
    carModel: false,
    customer: false,
  };

  private keys = ['backspace', 'arrowleft', 'arrowright'];
  private unsubscribe$ = new Subject<void>();
  private searchCustomerText$ = new Subject<string>();

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

  searchCustomer(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.customers.filter((customer: any) => customer.id == controlValue)[0];
      return;
    }

    let customerText = ((event.target as HTMLInputElement).value)?.trim();
    if(customerText && customerText !== ''){
      this.spinner.customer = true;
      this.searchCustomerText$.next(customerText);
    }
  }

  searchCarModelAPI(triggerBuildForm: boolean = false){
    let carTypeId = this.selectedCarType?.id || this.selectedCarTypeId;
    this.adminService.listCarModels({carTypeId: Number(carTypeId), skipLoadingInterceptor: true})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data && response.data.length > 0){
          this.carModels = response.data;
        } else{
          this.carModels = [];
        }
        this.spinner.carModel = false;
        if(triggerBuildForm) this.buildForm();
      },
      error: (err: any) => {
        this.spinner.carModel = false;
        console.log(err);
      }
    });
  }

  searchCustomerAPI(){
    this.searchCustomerText$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => this.adminService.showUsers({username: text, skipLoadingInterceptor: true}))
    ).subscribe({
      next: (response: any) =>{
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
  }

  getCarData(): void{
    this.route.paramMap.subscribe({
      next: params => {
        const carId = params.get('id');
        console.log("carNumber", carId);
        if(!carId)
          this.redirect();

        let car$ = this.adminService.showCars({carId:  Number(carId!)}) as Observable<CarsAPI>;
        let carType$ = this.adminService.listCarTypes({}) as Observable<CarTypeArrayAPI>;

        combineLatest([car$, carType$])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: ([car, carType]) => {
            if(!car.data || car.data.length < 0)
              this.redirect();

            this.car = car.data[0];
            this.selectedCarType = this.car.CarType;
            this.selectedCarModel = this.car.CarModel;
            if(carType.data)
              this.carTypes =  carType.data;

            this.searchCarModelAPI(true);
          }
        })
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
      productionYear: new Date(this.car.productionYear).getFullYear(),
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

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');
  }

  formCont(controlName: string): any{
    return this.editCarForm.controls[controlName];
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

  toggleModel(event: Event){
    this.selectedCarTypeId = this.formCont('carTypeId').value;
    this.selectedCarModel = undefined;
   if(!this.selectedCarTypeId)
     this.formCont('carModelId').disable();
   else{
     this.formCont('carModelId').enable();
     this.selectedCarType = undefined;
     this.spinner.carModel = true;
     this.searchCarModelAPI();
   }
 }
}
