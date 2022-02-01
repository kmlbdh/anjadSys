import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { UserAPI, updateUser } from '../../../../model/user';
import { RoleAPI, RegionAPI } from '../../../../model/general';
import { ConfirmedValidator } from '../confirm.validator';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;
  removeIdentityNum: boolean = true;
  removeCompanyName: boolean = true;
  private unsubscribe$ = new Subject<void>();
  user!: UserAPI;
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

  editUserForm = this.fb.group({
    identityNum: ['', [Validators.required,Validators.minLength(9), Validators.pattern('[0-9]*')]],
    username: ['', Validators.required],
    companyName: [''],
    password: [''],
    confirmPassword: [''],
    tel: [''],
    fax: [''],
    jawwal1: ['', Validators.required],
    jawwal2: [''],
    note: [''],
    address: [''],
    email: [''],
    roleId: ['', Validators.required],
    regionId: ['', Validators.required],
  }, {validators: ConfirmedValidator('password', 'confirmPassword')});

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getRegionsAndRoles();
    this.getUserData();
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  getUserData(){
    this.route.paramMap.subscribe({
      next: params => {
        const userID = params.get('id');
        console.log("userID", userID);
        if(!userID)
          this.router.navigate(['/admin/user/show']);

          this.adminService.showUsers({userID: userID!})
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: response => {
              if(response.data && response.data.length === 1)
              this.user = response.data[0];
              this.buildForm();
            }
          });
      }
    });
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

  updateUser = (): void => {
    let formObj: updateUser = {} as updateUser;
    formObj.id = this.user.id;

    let controlsObject = this.editUserForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.user[val])
            formObj[val] = currValue;
      }
    });

    if(Object.keys(formObj).length < 2){
      this.errorMsg = "يجب اجراء تغيير في المعلومات حتى يتم تحديثها!";
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.updateUser(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if(response.data)
            this.successMsg = response.message;
            // this.user = response.data;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

          // this.buildForm();
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

  buildForm():void{
    this.rebuildFormShared(Number(this.user.Role.id));

    this.editUserForm.setValue({
      identityNum: this.user.identityNum,
      username: this.user.username,
      companyName: this.user.companyName || '',
      password: '',
      confirmPassword: '',
      tel: this.user.tel || '',
      fax: this.user.fax || '',
      jawwal1: this.user.jawwal1,
      jawwal2: this.user.jawwal2 || '',
      note: this.user.note || '',
      email: this.user.email || '',
      address: this.user.address || '',
      roleId: this.user.Role.id,
      regionId: this.user.Region.id,
    });
  }

  changeForm(roleFormControl: any) {
    const role = Number(roleFormControl.value);
    this.rebuildFormShared(role);
  }

  rebuildFormShared(roleId: number){
    const roleString = this.rolesAPI.filter(roleAPI => Number(roleAPI.id) === roleId)[0]?.name;
    console.log('role', roleId, roleString);
    if(!roleString) return;

    this.removePassword = !(roleString === "supplier");
    this.removeCompanyName = !(roleString === "customer");
    this.removeIdentityNum = !(roleString === "admin");
    const identityNum = this.editUserForm.get('identityNum');

    if(roleString === this.roles["admin"]){
      identityNum?.clearValidators();
    } else {
      identityNum?.addValidators([Validators.required, Validators.minLength(5)]);
    }
    identityNum?.updateValueAndValidity;
  }

  get role(){
    return this.editUserForm.get('role')?.value;
  }

  formCont(controlName: string): AbstractControl{
    return this.editUserForm.controls[controlName];
  }

  acceptNumbers(event: KeyboardEvent): Boolean | undefined{
    const code = event.key;
    if(Number.isNaN(+code))
      if(code.toLowerCase() !== 'backspace')
        return false;

    return;
  }

}
