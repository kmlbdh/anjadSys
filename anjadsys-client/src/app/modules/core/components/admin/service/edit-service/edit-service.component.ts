import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  editServiceForm = this.fb.group({
    serviceName: ['', Validators.required],
    coverageDays: ['', Validators.required],
    cost: ['', Validators.required],
    dailyCost: ['', Validators.required],
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
    let formObj: { [index: string]: string | number} = {serviceID: this.service._id!};

    let controlsObject = this.editServiceForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if(controlsObject[val].dirty){
        let currValue = controlsObject[val].value;
        if(currValue !== '' && currValue !== this.service[val])
            formObj[val] = currValue;
      }
    });
    // if(this.removePassword){
    if(Object.keys(formObj).length < 2)
      return;

    this.adminService.updateService(formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
      next: (response) => {
        if(response.data)
          this.successMsg = response.message;
          this.service = response.data;
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

  getServiceById(){
    this.route.paramMap.subscribe({
        next: params => {
          const serviceId = params.get('id');
          console.log("userID", serviceId);
          if(!serviceId)
            this.router.navigate(['/admin/show-services']);

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
      serviceName: this.service.name,
      coverageDays: this.service.coverDays,
      dailyCost: this.service.dailyCost,
      cost: this.service.cost,
      note: this.service.note || ''
    });
  }

  calculateTotalCost(event: Event): void{
    if(!(event instanceof KeyboardEvent)) return;
    let coverDays = parseInt(this.editServiceForm.get('coverageDays')?.value);
    let dailyCost = parseFloat(this.editServiceForm.get('dailyCost')?.value);
    if(!isNaN(dailyCost) && !isNaN(coverDays)){
      this.editServiceForm.get('cost')?.markAsDirty();
      this.editServiceForm.get('cost')?.setValue(dailyCost*coverDays);
    }
  }

}


