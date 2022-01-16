import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { UserAPI } from '../../../../model/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;
  private unsubscribe$ = new Subject<void>();
  user!: UserAPI;
  roles:{
    [index: string]: string;
  } = {
    'agent': 'وكيل',
    'admin': 'مدير',
    'supplier':  'مورد بضاعة',
    'customer': 'زبون'
  };

  editUserForm = this.fb.group({
    username: ['', Validators.required],
    nickname: [''],
    password: [''],
    confirmPassword: [''],
    tel: [''],
    phone: [''],
    note: [''],
    address: [''],
    role: [{value: '', disabled: true}],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
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
          this.router.navigate(['/admin/show-users']);

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

  updateUser = (): void => {
    let formObj: { [index: string]: string | number} = {id: this.user._id};

    let controlsObject = this.editUserForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.user[val])
            formObj[val] = currValue;
      }
    });
    // if(this.removePassword){
    if(Object.keys(formObj).length < 2)
      return;

    this.adminService.updateUser(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          this.user = response.data;
          setTimeout(() => this.successMsg = undefined, 50000);

        this.buildForm();
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message){
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, 50000);
        }
      }
    });

    console.log(formObj);
  }

  buildForm():void{
    if(this.user.role === 'supplier')
      this.removePassword = false;
    else
      this.removePassword = true;

    this.editUserForm.setValue({
      username: this.user.username,
      nickname: this.user.nickname || '',
      password: '',
      confirmPassword: '',
      tel: this.user.tel || '',
      phone: this.user.phone || '',
      note: this.user.note || '',
      address: this.user.address || '',
      role: this.roles[this.user.role],
    });
  }

  changeForm(roleFormControl: any) {
    const role = roleFormControl.value;
    if(!role) return;

    this.removePassword = !(role === "supplier");
    let pass = this.editUserForm.get('password');
    let conPass = this.editUserForm.get('confirmPassword');

    if(role === "supplier"){
      pass?.clearValidators();
      conPass?.clearValidators();
    } else {
      pass?.addValidators([Validators.required]);
      conPass?.addValidators([Validators.required]);
    }

    pass?.updateValueAndValidity;
    conPass?.updateValueAndValidity;
  }

  get role(){
    return this.editUserForm.get('role')?.value;
  }

}
