import { CarTypeAPI, updateCarType } from 'src/app/modules/core/model/car';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-car-type',
  templateUrl: './edit-car-type.component.html',
  styleUrls: ['./edit-car-type.component.scss']
})
export class EditCarTypeComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  successMsg: string | undefined;

  carType!: CarTypeAPI;
  private unsubscribe$ = new Subject<void>();

  TIMEOUTMILISEC = 7000;

  editCarTypeForm = this.fb.group({
    name: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getCarTypeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateCarType = (): void => {
    let formObj: updateCarType = {} as updateCarType;
    const carTypeId = this.carType.id;

    let controlsObject = this.editCarTypeForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.carType[val])
            formObj[val] = currValue;
      }
    });

    if(Object.keys(formObj).length === 0){
      this.errorMsg = "يجب اجراء تغيير في المعلومات حتى يتم تحديثها!";
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.CarTypesAPIs.update(carTypeId, formObj)
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

  getCarTypeData(){
    this.route.paramMap.subscribe({
      next: params => {
        const carTypeId = params.get('id');
        console.log("carModelId", carTypeId);
        if(!carTypeId)
          this.router.navigate(['/admin/car/car-type/show']);

          this.adminService.CarTypesAPIs.list({carTypeId:  Number(carTypeId!)})
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: response => {
              if(response.data && response.data.length === 1)
              this.carType = response.data[0];
              this.buildForm();
            }
          });
      }
    });
  }

  buildForm():void{
    this.editCarTypeForm.setValue({
      name: this.carType.name,
    });
  }

  formCont(controlName: string): any{
    return this.editCarTypeForm.controls[controlName];
  }

}
