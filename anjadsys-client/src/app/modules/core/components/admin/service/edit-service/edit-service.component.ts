import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { ServiceAPI } from '../../../../model/service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.scss']
})
export class EditServiceComponent implements OnInit, OnDestroy {
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  private unsubscribe$ = new Subject<void>();
  service!: Partial<ServiceAPI>;
  TIMEOUTMILISEC = 7000;

  editServiceForm = this.fb.group({
    name: ['', Validators.required],
    coverageDays: ['', Validators.required],
    cost: ['', Validators.required],
    note: [''],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getServiceById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateService = (): void => {
    let formObj: { [index: string]: string | number} = {serviceID: this.service.id!};

    let controlsObject = this.editServiceForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.service[val])
            formObj[val] = currValue;
      }
    });

    if(Object.keys(formObj).length < 2){
      this.errorMsg = "يجب اجراء تغيير في المعلومات حتى يتم تحديثها!";
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.updateService(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          // this.service = response.data;
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

  getServiceById(){
    this.route.paramMap.subscribe({
        next: params => {
          const serviceId = params.get('id');
          console.log("userID", serviceId);
          if(!serviceId)
            this.router.navigate(['/admin/service/show']);

            this.adminService.listServices({serviceID: serviceId!})
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: response => {
                if(response.data && response.data.length === 1)
                this.service = response.data[0];
                this.buildForm();
              }
            });
        }
      });
  }

  buildForm(): void{
    this.editServiceForm.setValue({
      name: this.service.name,
      coverageDays: this.service.coverageDays,
      cost: this.service.cost,
      note: this.service.note || ''
    });
  }

  formCont(controlName: string): AbstractControl{
    return this.editServiceForm.controls[controlName];
  }

  acceptNumbers(event: KeyboardEvent): Boolean | undefined{
    const code = event.key;
    if(Number.isNaN(+code))
      if(code.toLowerCase() !== 'backspace')
        return false;

    return;
  }

}


