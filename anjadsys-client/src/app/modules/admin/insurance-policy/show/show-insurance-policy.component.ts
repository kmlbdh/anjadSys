import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  SearchInsurancePolicy,
  InsurancePolicyAPI,
  InsurancePolicesAPI
} from '@models/insurancepolicy';
import { AdminService } from '../../admin.service';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SearchUser, UserAPI } from '@models/user';
import {
  InsurancePolicyComponent
} from '@shared/components/insurance-policy-modal/insurance-policy.component';

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
  selectedAgent: UserAPI | undefined;
  customers: UserAPI[] = [];
  agents: UserAPI[] = [];

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  private searchCustomerText$ = new Subject<string>();
  private searchAgentText$ = new Subject<string>();

  currency = 'شيكل';
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchInsurancePolicy = {};

  TIMEOUTMILISEC = 7000;

  spinnerCustomer$ = new BehaviorSubject<boolean>(false);
  spinnerAgent$ = new BehaviorSubject<boolean>(false);

  constructor(
      private adminService: AdminService,
      private router: Router,
      private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getInsurancePolices(this.searchConditions);
    this.searchCustomerAPI();
    this.searchAgentAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSelectedCustomer(event: UserAPI | undefined) {
    if (event) { this.selectedCustomer = event; }
  }

  getSelectedAgent(event: UserAPI | undefined) {
    if (event) { this.selectedAgent = event; }
  }

  searchCustomerAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.lightlist(
      { username: val, role: 'customer', skipLoadingInterceptor: true } as SearchUser);

    this.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinnerCustomer$.next(true)),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinnerCustomer$.next(false);
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinnerCustomer$.next(false);
        }
      });
  }

  searchCustomer(event: Event): void {
    // console.log(event);

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchAgentAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.lightlist(
      { username: val, companyName: val, skipLoadingInterceptor: true, role: 'agent' } as SearchUser);

    this.searchAgentText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinnerAgent$.next(true)),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.agents = response.data;
          }
          this.spinnerAgent$.next(false);
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinnerAgent$.next(false);
        }
      });
  }

  searchAgent(event: Event): void {
    // console.log(event);

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchAgentText$.next(typeTxt);
    }
  }


  searchInsurancePolicy(searchConditions: SearchInsurancePolicy) {
    let lastSearchConditions = { ...searchConditions, ... this.searchConditions };
    console.log('searchConditions', lastSearchConditions);
    this.getInsurancePolices(lastSearchConditions);
  }

  open(insurancePolicyId: number) {
    let searchCondition: SearchInsurancePolicy = { insurancePolicyId: insurancePolicyId };
    this.adminService.InsurancePoliciesAPIs.list(searchCondition)
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
    this.adminService.InsurancePoliciesAPIs.list(searchConditions)
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

  deleteInsurancePolicy(insurancePolicy: InsurancePolicyAPI) {
    if (!insurancePolicy) { return; }

    const yes = confirm(`هل تريد حذف بوليصة التأمين رقم ${ insurancePolicy.id } للزبون ${ insurancePolicy.Customer.username }`);
    if (!yes) { return; }

    this.adminService.InsurancePoliciesAPIs.delete(insurancePolicy.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.getInsurancePolices(this.searchConditions);
          }
          console.log(response);
        },
        error: (err: any) => console.log(err)
      });
  }

  goToInsurancePolicyEdit(id: number) {
    this.router.navigate([ 'admin/insurance-policy/edit', id ]);
  }

  goToEndorsements(id: number) {
    this.router.navigate([ 'admin/endorsement/show', { insurancePolicyId: id } ]);
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchInsurancePolicy;
    this.p = pageNumber;
    this.getInsurancePolices(this.searchConditions);
    console.log(pageNumber);
  }

}
