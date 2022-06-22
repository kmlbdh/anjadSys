import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import {
  InsurancePolicesAPI,
  InsurancePolicyAPI,
  SearchInsurancePolicy
} from 'src/app/modules/core/model/insurancepolicy';
import { AgentService } from '../../agent.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SearchUser, UserAPI } from '../../../../model/user';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import {
  InsurancePolicyComponent
} from '../../../../../shared/components/insurance-policy-modal/insurance-policy.component';

@Component({
  selector: 'app-show-insurance-policy',
  templateUrl: './show-insurance-policy.component.html',
  styleUrls: ['./show-insurance-policy.component.scss']
})
export class ShowInsurancePolicyComponent implements OnInit, OnDestroy {

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  insurancePolices: InsurancePolicyAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  trashIcon = faTrashAlt;
  carEditIcon = faEdit;
  cancelInput = faTimes;

  private unsubscribe$ = new Subject<void>();
  agentName = JSON.parse(localStorage.getItem('user') || '');

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    customer: false,
  };

  private searchCustomerText$ = new Subject<string>();

  currency = 'شيكل';
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchInsurancePolicy = {};

  searchInsurancePolicyForm = this.fb.group({
    insurancePolicyId: [''],
    customerID: [''],
    carID: [''],
  });

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private modalService: NgbModal
  ) {
    this.agentName = this.agentName.companyName;
  }

  ngOnInit(): void {
    this.getInsurancePolices(this.searchConditions);
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCustomerAPI() {
    let callback = (val: string) => this.agentService.UsersAPI.lightList(
      { username: val, skipLoadingInterceptor: true } as SearchUser);

    this.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinner.customer = false;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.customer = false;
        }
      });
  }

  searchCustomer(event: Event): void {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('customerID')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.spinner.customer = true;
      this.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI {
    event.preventDefault();
    event.stopPropagation();
    let selectedOne: UserAPI;
    selectedOne = array.filter((unit: any) => unit.id == controlValue)[0];
    return selectedOne;
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');
  }

  searchInsurancePolicy(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchInsurancePolicy = {};
    keys.forEach(key => {
      searchConditions[key] = this.searchInsurancePolicyForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.getInsurancePolices(searchConditions);
  }

  open(insurancePolicyId: number) {
    let searchCondition: SearchInsurancePolicy = { insurancePolicyId: insurancePolicyId };
    this.agentService.InsurancePolicesAPI.list(searchCondition)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            const refModal = this.modalService.open(InsurancePolicyComponent, this.modalOptions);
            refModal.componentInstance.modalInsurancePolicy = response.data[0];
            refModal.result.then(result => {
              this.closeResult = `Closed with: ${ result }`;
            }, reason => {
              this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
            });
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${ reason }`;
    }
  }

  getInsurancePolices(searchConditions: SearchInsurancePolicy) {
    this.agentService.InsurancePolicesAPI.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: InsurancePolicesAPI) => {
          if (response.data) {
            this.insurancePolices = response.data;
            this.pagination.total = response.total;
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  // deleteInsurancePolicy(insurancePolicy: InsurancePolicyAPI){
  //   if(!insurancePolicy) return;

  //   const yes = confirm(`هل تريد حذف بوليصة التأمين رقم ${insurancePolicy.id} للزبون ${insurancePolicy.Customer.username}`);
  //   if(!yes) return;

  //   this.agentService.deleteInsurancePolicy(insurancePolicy.id)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe({
  //     next: response => {
  //       if(response.data)
  //         this.successMsg = response.message;

  //       this.getInsurancePolices(this.searchConditions);
  //       console.log(response);
  //     },
  //     error: (err: any) => console.log(err)
  //   })
  // }

  // goToInsurancePolicyEdit(id: number){
  //   this.router.navigate(['agent/insurance-policy/edit', id]);
  // }

  trackById(index: number, el: any) {
    return el.id;
  }

  formCont(controlName: string) {
    return this.searchInsurancePolicyForm.controls[controlName];
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchInsurancePolicy;
    this.p = pageNumber;
    this.getInsurancePolices(this.searchConditions);
    console.log(pageNumber);
  }

  printPage(): void {
    window.print();
  }

}

