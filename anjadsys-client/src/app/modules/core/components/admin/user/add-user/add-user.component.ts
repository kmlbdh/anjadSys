import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable, takeUntil, Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { RoleAPI, RegionAPI } from '../../../../model/general';
import { ConfirmedValidator } from '../confirm.validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;
  removeCompanyName: boolean = true;
  removeIdentityNum: boolean = true;

  private unsubscribe$ = new Subject<void>();
  rolesAPI!: RoleAPI[];
  regionsAPI!: RegionAPI[];
  roles:{
    [index: string]: string;
  } = {
    'agent': 'وكيل',
    'admin': 'مدير',
    'supplier':  'مورد',
    'customer': 'زبون'
  };

  TIMEOUTMILISEC = 7000;

  addUserForm = this.fb.group({
    identityNum: ['', [Validators.required, Validators.minLength(9), Validators.pattern('[0-9]*')]],
    username: ['', Validators.required],
    companyName: [''],
    password: ['', Validators.required],
    confirmPassword: ['', [Validators.required]],
    tel: [''],
    fax: [''],
    jawwal1: ['', Validators.required],
    jawwal2: [''],
    note: [''],
    address: [''],
    email: [''],
    roleId: ['', Validators.required],
    regionId: ['', Validators.required],
  }, { validators: ConfirmedValidator('password', 'confirmPassword')}
  );
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.getRegionsAndRoles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRegionsAndRoles(){
    this.adminService.getRegionsAndRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data && response.data.regions && response.data.roles)
        this.rolesAPI = response.data.roles;
        this.regionsAPI = response.data.regions;
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
    let dataAPI$!: Observable<any>;
    console.log("here is ", this.removePassword);

    if(this.removePassword){
      dataAPI$ = this.adminService.addUser(formObj);
    } else {
      delete formObj['role'];
      dataAPI$ = this.adminService.addSupplier(formObj);
    }

    dataAPI$
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

  changeForm(roleFormControl: any) {
    const role = roleFormControl.value;
    const roleString = this.rolesAPI.filter(roleAPI => roleAPI.id == role)[0]?.name;
    console.log('role', role, roleString);
    if(!roleString) return;

    this.removePassword = !(roleString === "supplier");
    this.removeCompanyName = !(roleString === "customer");
    this.removeIdentityNum = !(roleString === "admin");

    let pass = this.addUserForm.get('password');
    let conPass = this.addUserForm.get('confirmPassword');
    let identityNum = this.addUserForm.get('identityNum');
    let companyName = this.addUserForm.get('companyName');

    if(roleString === "supplier"){
      pass?.clearValidators();
      conPass?.clearValidators();
      this.addUserForm.clearValidators();
      pass?.setValue('');
      conPass?.setValue('');
    } else if(roleString === "admin"){
      identityNum?.clearValidators();
      identityNum?.setValue('');
    } else if(roleString === "customer"){
      companyName?.clearValidators();
      companyName?.setValue('');
    } else {
      pass?.addValidators([Validators.required]);
      conPass?.addValidators([Validators.required]);
      identityNum?.addValidators([Validators.required, Validators.minLength(5)]);
      this.addUserForm.addValidators(ConfirmedValidator('password', 'confirmPassword'))
    }
    identityNum?.updateValueAndValidity;
    pass?.updateValueAndValidity;
    conPass?.updateValueAndValidity;
    this.addUserForm.updateValueAndValidity;
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

  acceptNumbers(event: KeyboardEvent): Boolean | undefined{
    const code = event.key;
    if(Number.isNaN(+code))
      if(code.toLowerCase() !== 'backspace')
        return false;

    return;
  }
}
