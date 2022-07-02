import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { CarTypeAPI, updateCarModel } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CarModelAPI } from '@models/car';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-car-model',
  templateUrl: './edit-car-model.component.html',
  styleUrls: ['./edit-car-model.component.scss']
})
export class EditCarModelComponent implements OnInit, OnDestroy {

  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  selectedCarType: CarTypeAPI | undefined;
  carTypeName: string | undefined;
  carTypes: any[] = [];
  carModel!: CarModelAPI;
  private unsubscribe$ = new Subject<void>();
  private searchCarTypeText$ = new Subject<string>();
  spinnerCarType: boolean = false;

  TIMEOUTMILISEC = 7000;

  editCarModelForm = this.fb.group({
    name: [ '', [Validators.required] ],
    carTypeId: [ '', [Validators.required] ]
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getCarModelData();
    this.searchAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateCarModel = (): void => {
    let formObj: updateCarModel = {} as updateCarModel;
    const carModelId = this.carModel.id;

    let controlsObject = this.editCarModelForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if (controlsObject[val].dirty) {
        let currValue = controlsObject[val].value;
        if (currValue !== '' && currValue !== this.carModel[val]) { formObj[val] = currValue; }
      }
    });

    if (Object.keys(formObj).length === 0) {
      this.errorMsg = 'يجب اجراء تغيير في المعلومات حتى يتم تحديثها!';
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.CarModelsAPIs.update(carModelId, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
          }
          console.log(response);
        },
        error: err => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });

    console.log(formObj);
  };

  searchCarType(event: Event) {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      event.preventDefault();
      event.stopPropagation();
      this.selectedCarType = this.carTypes.filter(carType =>
        carType.id === Number(this.formCont('carTypeId')?.value))[0];
      this.carTypeName = `${ this.selectedCarType?.name }`;
      return;
    }
    if (this.formCont('carTypeId')?.value === '') { this.carTypeName = undefined; }

    let carTypeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (carTypeTxt) { this.searchCarTypeText$.next(carTypeTxt); }
  }

  searchAPI() {
    this.searchCarTypeText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(text => this.adminService.CarTypesAPIs.list({ name: text }))
      ).subscribe({
        next: response => {
          if (response.data) { this.carTypes = response.data; }
          console.log(response);
        },
        error: err => console.log(err)
      });
  }

  getCarModelData() {
    this.route.paramMap.subscribe({
      next: params => {
        const carModelId = params.get('id');
        console.log('carModelId', carModelId);
        if (!carModelId) { this.router.navigate(['/admin/car/car-model/show']); }

        this.adminService.CarModelsAPIs.list({ carModelId:  Number(carModelId!) })
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: response => {
              if (response.data && response.data.length) {
                this.carModel = response.data[0];
                this.buildForm();
              }
            }
          });
      }
    });
  }

  buildForm():void {
    this.editCarModelForm.setValue({
      name: this.carModel.name,
      carTypeId: this.carModel.CarType.id,
    });
    this.carTypeName = this.carModel.CarType.name;
  }

  formCont(controlName: string): any {
    return this.editCarModelForm.controls[controlName];
  }

  cancelCarTypeInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCarType = undefined;
    this.carTypeName = undefined;
    this.formCont('carTypeId')?.setValue('');
  }

}
