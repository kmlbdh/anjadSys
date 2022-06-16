import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit, OnDestroy{
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;

  errorMsg: string | undefined;
  successMsg: string | undefined;

  TIMEOUTMILISEC = 7000;

  private unsubscribe$ = new Subject<void>();

  private keys = ['backspace', 'arrowleft', 'arrowright'];

  packageTypeArray = ['الضفة الغربية', 'القدس', 'القدس والضفة الغربية'];

  addServiceForm = this.fb.group({
    name: ['', Validators.required],
    coverageDays: ['', Validators.required],
    cost: ['', Validators.required],
    supplierPercentage: ['', Validators.required],
    packageType: [0, Validators.required],
    note: [''],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addService = (ngForm: FormGroupDirective) => {
    if(this.addServiceForm.invalid) return;

    let formObj = this.addServiceForm.value;

    this.adminService.ServicesAPIs.add(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        this.resetForm(ngForm);
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);

      }
    });
    console.log(this.addServiceForm.value);
    console.log(formObj);
  }

  resetForm(ngform: FormGroupDirective){
    this.addServiceForm.reset();
    this.addServiceForm.updateValueAndValidity();
    this.addServiceForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any{
    return this.addServiceForm.controls[controlName];
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

}

