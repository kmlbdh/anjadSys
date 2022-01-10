import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  removePassword: boolean = true;

  addUserForm = this.fb.group({
    username: ['', Validators.required],
    nickname: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    tel: [''],
    phone: [''],
    note: [''],
    address: [''],
    role: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
  }

  addUser = () => {
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

    dataAPI$.subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;

        this.resetForm();
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message)
          this.errorMsg = err.error.message;
      }
    });
    console.log(this.addUserForm.value);
    console.log(formObj);
  }

  changeForm(roleFormControl: any) {
    const role = roleFormControl.value;
    if(!role) return;

    this.removePassword = !(role === "supplier");
    let pass = this.addUserForm.get('password');
    let conPass = this.addUserForm.get('confirmPassword');

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

  resetForm(){
    this.addUserForm.reset();
  }

}
