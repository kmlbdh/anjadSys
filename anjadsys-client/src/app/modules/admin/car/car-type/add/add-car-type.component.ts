import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-add-car-type',
  templateUrl: './add-car-type.component.html',
  styleUrls: ['./add-car-type.component.scss']
})
export class AddCarTypeComponent implements OnDestroy {

  errorMsg: string | undefined;
  successMsg: string | undefined;

  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];
  private unsubscribe$ = new Subject<void>();

  TIMEOUTMILISEC = 7000;

  addCarTypeForm = this.fb.group({
    name: [ '', [Validators.required] ],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addCarType = (ngform: FormGroupDirective) => {
    console.log(this.addCarTypeForm);
    if (this.addCarTypeForm.invalid) { return; }

    let formObj = this.addCarTypeForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });

    this.adminService.CarTypesAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.resetForm(ngform);
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
    console.log(this.addCarTypeForm.value);
    console.log(formObj);
  };

  resetForm(ngform: FormGroupDirective) {
    this.addCarTypeForm.reset();
    this.addCarTypeForm.updateValueAndValidity();
    this.addCarTypeForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any {
    return this.addCarTypeForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean {
    if (event instanceof KeyboardEvent) {
      const code = event.key;
      console.log(code);
      if (Number.isNaN(+code)) {
        if (!this.keys.includes(code.toLowerCase())) { return false; }
      }
    }
    return true;
  }

}
