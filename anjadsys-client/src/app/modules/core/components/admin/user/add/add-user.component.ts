import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, takeUntil, Subject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { RoleAPI, RegionAPI } from '../../../../model/general';
import { ConfirmedValidator } from '../confirm.validator';
import { IBreadCrumb } from '../../../../../shared/models/breadcrumb';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;
  removeCompanyName: boolean = true;
  removeIdentityNum: boolean = true;
  addServicesPackage: boolean = false;

  private unsubscribe$ = new Subject<void>();
  rolesAPI!: RoleAPI[];
  regionsAPI!: RegionAPI[];
  breadcrumbs: IBreadCrumb[] = [];
  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];
  roles:{
    [index: string]: string;
  } = {
      'agent': 'وكيل',
      'admin': 'مدير',
      'supplier':  'مورد',
      'customer': 'زبون'
    };

  servicesPackageArray = [ 'الضفة الغربية', 'القدس' ];

  TIMEOUTMILISEC = 7000;

  addUserForm = this.fb.group({
    identityNum: [ '', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
    username: [ '', Validators.required ],
    companyName: [''],
    password: [ '', Validators.required ],
    confirmPassword: [ '', [Validators.required] ],
    tel: [ '', [ Validators.minLength(7), Validators.maxLength(9) ] ],
    fax: [ '', [ Validators.minLength(7), Validators.maxLength(9) ] ],
    jawwal1: [ '', [ Validators.required, Validators.minLength(9), Validators.maxLength(10) ] ],
    jawwal2: [ '', [ Validators.minLength(9), Validators.maxLength(10) ] ],
    note: [''],
    address: [''],
    email: [ '', Validators.pattern('^([A-Za-z0-9-_.])+\@([A-Za-z0-9])+\.([A-Za-z]){2,3}$') ],
    roleId: [ '', Validators.required ],
    regionId: [ '', Validators.required ],
    blocked: [ false, Validators.required ],
    servicesPackage: [ 0, Validators.required ],
  }, { validators: ConfirmedValidator('password', 'confirmPassword') }
  );
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) {}

  ngOnInit(): void {
    this.getRegionsAndRoles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRegionsAndRoles() {
    this.adminService.GeneralAPIs.regionsAndRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data && response.data.regions && response.data.roles) {
            this.rolesAPI = response.data.roles;
            this.regionsAPI = response.data.regions;
          }
        }
      });
  }

  addUser = (ngform: FormGroupDirective) => {
    console.log(this.addUserForm);
    if (this.addUserForm.invalid) { return; }

    let formObj = this.addUserForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if (formObj[k] === '') { delete formObj[k]; }
    });
    let dataAPI$!: Observable<any>;
    // console.log("here is ", this.removePassword);

    if (Number(formObj.roleId) !== 4) {
      dataAPI$ = this.adminService.UsersAPIs.add(formObj);
    } else {
      delete formObj['role'];
      dataAPI$ = this.adminService.SuppliersAPIs.add(formObj);
    }

    dataAPI$
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
    // console.log(this.addUserForm.value);
    // console.log(formObj);
  };

  changeForm(roleFormControl: any) {
    const role = roleFormControl.value;
    const roleString = this.rolesAPI.filter(roleAPI => roleAPI.id == role)[0]?.name;
    // console.log('role', role, roleString);
    if (!roleString) { return; }

    this.removePassword = !(roleString === 'supplier' || roleString === 'customer');
    this.removeCompanyName = !(roleString === 'customer' || roleString === 'admin');
    this.addServicesPackage = (roleString === 'agent');
    this.removeIdentityNum = !(roleString === 'admin');

    let pass = this.addUserForm.get('password');
    let conPass = this.addUserForm.get('confirmPassword');
    let identityNum = this.addUserForm.get('identityNum');
    let companyName = this.addUserForm.get('companyName');
    let servicesPackage = this.addUserForm.get('servicesPackage');

    if (roleString === 'supplier' || roleString === 'customer') {
      this.addUserForm.removeValidators(ConfirmedValidator('password', 'confirmPassword'));
      pass?.clearValidators();
      conPass?.clearValidators();
      pass?.setValue('');
      conPass?.setValue('');
      servicesPackage?.setValue('');
      servicesPackage?.clearValidators();
      identityNum?.addValidators([ Validators.required, Validators.minLength(9), Validators.maxLength(9) ]);
    } else if (roleString === 'agent' || roleString === 'admin') {
      pass?.addValidators([Validators.required]);
      conPass?.addValidators([Validators.required]);
      this.addUserForm.addValidators(ConfirmedValidator('password', 'confirmPassword'));
    }

    if (roleString === 'supplier') {
      companyName?.addValidators([Validators.required]);
    } else if (roleString === 'customer') {
      companyName?.clearValidators();
      companyName?.setValue('');
    } else if (roleString === 'admin') {
      companyName?.clearValidators();
      companyName?.setValue('');

      identityNum?.clearValidators();
      identityNum?.setValue('');

      servicesPackage?.setValue('');
      servicesPackage?.clearValidators();
    } else if (roleString === 'agent') {
      servicesPackage?.addValidators([Validators.required]);
      servicesPackage?.setValue(0);
      companyName?.addValidators([Validators.required]);
      identityNum?.addValidators([ Validators.required, Validators.minLength(9), Validators.maxLength(9) ]);
    }

    servicesPackage?.updateValueAndValidity();
    identityNum?.updateValueAndValidity();
    pass?.updateValueAndValidity();
    conPass?.updateValueAndValidity();
    this.addUserForm.updateValueAndValidity();

    this.addUserForm.reset({ roleId: role, blocked: false });
    this.addUserForm.markAsUntouched();
  }

  resetForm(ngform: FormGroupDirective) {
    this.addUserForm.reset();
    this.addUserForm.updateValueAndValidity();
    this.addUserForm.markAsUntouched();
    ngform.resetForm();
    this.formCont('blocked').setValue(false);
  }

  formCont(controlName: string): any {
    return this.addUserForm.controls[controlName];
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
