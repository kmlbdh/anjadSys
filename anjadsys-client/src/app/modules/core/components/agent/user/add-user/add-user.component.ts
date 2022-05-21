import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RegionAPI } from 'src/app/modules/core/model/general';
import { AgentService } from '../../agent.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  successMsg: string | undefined;

  private unsubscribe$ = new Subject<void>();
  regionsAPI!: RegionAPI[];
  private keys = ['backspace', 'arrowleft', 'arrowright'];

  TIMEOUTMILISEC = 7000;

  addUserForm = this.fb.group({
    identityNum: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('[0-9]{9}')]],
    username: ['', Validators.required],
    tel: ['', [Validators.minLength(7), Validators.maxLength(9)]],
    fax: ['', [Validators.minLength(7), Validators.maxLength(9)]],
    jawwal1: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
    jawwal2: ['', [Validators.minLength(9), Validators.maxLength(10)]],
    note: [''],
    address: [''],
    email: ['', Validators.pattern('^([A-Za-z0-9-_.])+\@([A-Za-z0-9])+\.([A-Za-z]){2,3}$')],
    regionId: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService) { }

  ngOnInit(): void {
    this.getRegions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRegions(){
    this.agentService.GeneralAPIs.regions()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.regionsAPI = response.data;
      }
    });
  }

  addUser = (ngform: FormGroupDirective) => {
    console.log(this.addUserForm);
    if (this.addUserForm.invalid) return;

    let formObj = this.addUserForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });

    this.agentService.UsersAPI.add(formObj)
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
    console.log(this.addUserForm.value);
    console.log(formObj);
  }


  resetForm(ngform: FormGroupDirective){
    this.addUserForm.reset();
    this.addUserForm.updateValueAndValidity();
    this.addUserForm.markAsUntouched();
    ngform.resetForm();
  }

  formCont(controlName: string): any{
    return this.addUserForm.controls[controlName];
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
