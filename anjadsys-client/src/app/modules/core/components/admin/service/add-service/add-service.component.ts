import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;

  addServiceForm = this.fb.group({
    serviceName: ['', Validators.required],
    coverageDays: ['', Validators.required],
    cost: ['', Validators.required],
    dailyCost: ['', Validators.required],
    note: [''],
  });
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService) { }

  ngOnInit(): void {
  }

  addService = () => {
    let formObj = this.addServiceForm.value;
    let keys = Object.keys(formObj);
    keys.forEach(k => {
      if(formObj[k] === "") delete formObj[k]
    });
      this.adminService.addService(formObj)
      .subscribe({
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
    console.log(this.addServiceForm.value);
    console.log(formObj);
  }

  resetForm(){
    this.addServiceForm.reset();
  }

  calculateTotalCost(event: Event){
    if(!(event instanceof KeyboardEvent)) return;
    let coverDays = parseInt(this.addServiceForm.get('coverageDays')?.value);
    let dailyCost = parseFloat(this.addServiceForm.get('dailyCost')?.value);
    if(!isNaN(dailyCost) && !isNaN(coverDays))
      this.addServiceForm.get('cost')?.setValue(dailyCost*coverDays);
  }

}

