import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  InsurancePolicesAPI,
  InsurancePolicyAPI,
  SearchInsurancePolicy
} from '@models/insurancepolicy';
import { SearchUser, UserAPI } from '@models/user';
import { AdminService } from '../../admin.service';
import {
  OtherServiceAPI,
  SearchOtherServices,
  updateOtherService
} from '@models/otherservices';

@Component({
  selector: 'app-edit-otherservices',
  templateUrl: './edit-otherservices.component.html',
  styleUrls: ['./edit-otherservices.component.scss']
})
export class EditOtherservicesComponent implements OnInit, OnDestroy {

  errorMsg: string | undefined;
  successMsg: string | undefined;
  insurancePolicyNotValidMsg: string | undefined;
  otherService!: Partial<OtherServiceAPI>;

  TIMEOUTMILISEC = 7000;

  insurancePolicies: InsurancePolicyAPI[] = [];
  customers: UserAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  selectedInsurancePolicy: InsurancePolicyAPI | undefined;

  spinner = {
    customer: false,
    insurancePolicy: false,
  };

  private unsubscribe$ = new Subject<void>();
  private searchTextObj = {
    searchCustomerText$: new Subject<string>(),
  };
  private keys = [ 'backspace', 'arrowleft', 'arrowright' ];

  fileStatusArr = [ 'مفتوح', 'مغلق' ];
  serviceKindArr = [ 'خدمة تحقيق', 'خدمة متابعة' ];

  editOtherServiceForm = this.fb.group({
    name: [ '', Validators.required ],
    fileStatus: [ '', Validators.required ],
    serviceKind: [ null, Validators.required ],
    descCustomer: [ '', Validators.required ],
    description: [ '', Validators.required ],
    cost: [ '', Validators.required ],
    customerId: [ '', Validators.required ],
    insurancePolicyId: [ '', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) {
    this.searchCustomerAPI();
  }

  ngOnInit(): void {
    this.getOtherServiceById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getOtherServiceById() {
    this.route.paramMap.subscribe({
      next: params => {
        const otherServiceId = Number(params.get('id'));
        console.log('otherServiceId', otherServiceId);
        if (!otherServiceId) { this.router.navigate(['/admin/otherservices/show']); }
        let searchOtherServices: SearchOtherServices = { otherServiceID: otherServiceId! } as SearchOtherServices;
        this.adminService.OtherServicesAPIs.show(searchOtherServices)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (response: any) => {
              if (response.data && response.data.length) {
                this.otherService = response.data[0];
                this.buildForm();
              }
            }
          });
      }
    });
  }

  updateOtherService = (): void => {
    let formObj: updateOtherService = {} as updateOtherService;

    const otherServiceID = this.otherService.id!;

    let controlsObject = this.editOtherServiceForm.controls;
    let keys = Object.keys(controlsObject);
    keys.forEach((val: string) => {
      if (controlsObject[val].dirty) {
        let currValue = controlsObject[val].value;
        if (currValue !== '' && currValue !== this.otherService[val]) { formObj[val] = currValue; }
      }
    });

    if (Object.keys(formObj).length === 0) {
      this.errorMsg = 'يجب اجراء تغيير في المعلومات حتى يتم تحديثها!';
      setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
      return;
    }

    this.adminService.OtherServicesAPIs.update(otherServiceID, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
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

    console.log(formObj);
  };

  searchCustomerAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.list(
      { username: val, role: 'customer', agent: true, skipLoadingInterceptor: true } as SearchUser);
    this.searchTextObj.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinner.customer = true),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinner.customer = false;
          // console.log(response);
        },
        error: (err: any) => {
          this.spinner.customer = false;
          console.log(err);
        }
      });
  }

  searchCustomer(event: Event): void {
    // console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerId')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      // if(this.selectedCustomer) this.selectedAgent = this.selectedCustomer.Agent;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchTextObj.searchCustomerText$.next(typeTxt);
    }
  }

  getInsurancePolicies() {
    this.spinner.insurancePolicy = true;
    console.log(this.selectedCustomer);
    if (!this.selectedCustomer) {
      this.spinner.insurancePolicy = false;
      return;
    }

    let customerId = this.selectedCustomer!.id;
    this.insurancePolicyNotValidMsg = undefined;
    let searchConditions: SearchInsurancePolicy = { customerID: customerId, filterOutValid: true };
    this.adminService.InsurancePoliciesAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            this.insurancePolicies = response.data;
          }
          this.spinner.insurancePolicy = false;
        },
        error: (error: any) => {
          if (error.error.message) { this.insurancePolicyNotValidMsg = error.error.message; }
          this.spinner.insurancePolicy = false;
          console.log(error);
        }
      });
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any):
   UserAPI | InsurancePolicyAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI | InsurancePolicyAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  buildForm(): void {
    this.editOtherServiceForm.setValue({
      name: this.otherService.name,
      fileStatus: this.otherService.fileStatus,
      serviceKind: this.otherService.serviceKind,
      descCustomer: this.otherService.descCustomer,
      description: this.otherService.description,
      cost: this.otherService.cost,
      customerId: this.otherService.customerId,
      insurancePolicyId: this.otherService.insurancePolicyId,
    });
    this.selectedInsurancePolicy = { id: this.otherService.insurancePolicyId } as InsurancePolicyAPI;
    this.selectedCustomer = this.otherService.Customer;
  }

  fillFieldsByCustomer(event: Event) {
    if (event instanceof KeyboardEvent) { return; }
    console.log(event);
    setTimeout(() => {
      this.getInsurancePolicies();
    }, 0);
  }

  selectInsurancePolicy(event: Event) {
    // console.log('change', event);
    if (event.type === 'change') {
      const controlValue = this.formCont('insurancePolicyId')?.value;
      this.selectedInsurancePolicy = this.mouseEventOnSearch(event, this.insurancePolicies!, controlValue) as InsurancePolicyAPI;
      // console.log(this.selectedInsurancePolicy);
      return;
    }
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');

    this.cancelInsurancePolicyInput(event);
  }

  cancelInsurancePolicyInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedInsurancePolicy = undefined;
    this.formCont('insurancePolicyId').setValue('');
  }

  formCont(controlName: string): any {
    return this.editOtherServiceForm.controls[controlName];
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
