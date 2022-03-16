import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { CarTypeAPI } from '../../../../../model/car';

@Component({
  selector: 'app-add-car-model',
  templateUrl: './add-car-model.component.html',
  styleUrls: ['./add-car-model.component.scss']
})
export class AddCarModelComponent implements OnInit, OnDestroy {
  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  selectedCarType: CarTypeAPI | undefined;
  carTypeName: string | undefined;
  carTypes: any[] = [];
  private unsubscribe$ = new Subject<void>();
  private searchCarTypeText$ = new Subject<string>();
  spinnerCarType: boolean = false;

  TIMEOUTMILISEC = 7000;

  addCarModelForm = this.fb.group({
    name: ['', [Validators.required]],
    carTypeId: ['', [Validators.required]],
    note: ['']
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.searchAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCarModel = (ngform: FormGroupDirective) => {
    console.log(this.addCarModelForm);
    if (this.addCarModelForm.invalid) return;

    let formObj = this.addCarModelForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });

   this.adminService.addCarModel(formObj)
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
    console.log(this.addCarModelForm.value);
    console.log(formObj);
  }

  searchCarType(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      event.preventDefault();
      event.stopPropagation();
      this.selectedCarType = this.carTypes.filter(carType => {
        console.log(this.formCont('carTypeId')?.value);
        console.log(carType.id);
        return carType.id === Number(this.formCont('carTypeId')?.value)
      })[0];
      this.carTypeName = `${this.selectedCarType?.name}`;
      return;
    }
    if(this.formCont('carTypeId')?.value === '')
      this.carTypeName = undefined;

    let carTypeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(carTypeTxt){
      this.searchCarTypeText$.next(carTypeTxt);
    }
  }

  searchAPI(){
    this.searchCarTypeText$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.spinnerCarType = true),
      switchMap(text => this.adminService.listCarTypes({name: text, skipLoadingInterceptor: true}))
    ).subscribe({
      next: response =>{
        if(response.data){
          this.carTypes = response.data;
        }
        this.spinnerCarType = false;
        console.log(response)
      },
      error: err => {
        this.spinnerCarType = false;
        console.log(err);
      }
    })
  }

  resetForm(ngform: FormGroupDirective){
    this.addCarModelForm.reset();
    this.addCarModelForm.updateValueAndValidity();
    this.addCarModelForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any{
    return this.addCarModelForm.controls[controlName];
  }

  cancelCarTypeInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCarType = undefined;
    this.carTypeName = undefined;
    this.formCont('carTypeId')?.setValue('');
  }

  // acceptNumbers(event: KeyboardEvent): Boolean | undefined{
  //   const code = event.key;
  //   if(Number.isNaN(+code))
  //     return false;

  //   return;
  // }

}
