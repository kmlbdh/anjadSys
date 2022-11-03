import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  InsurancePolicesAPI,
  InsurancePolicyAPI,
  SearchInsurancePolicy
} from '@models/insurancepolicy';
import { AgentService } from '../../agent.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
  customers: UserAPI[] = [];

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

  TIMEOUTMILISEC = 7000;

  spinnerCustomer$ = new BehaviorSubject<boolean>(false);

  constructor(
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

  getSelectedCustomer(event: UserAPI | undefined) {
    if (event) { this.selectedCustomer = event; }
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
    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchInsurancePolicy(searchConditions: SearchInsurancePolicy) {
    let lastSearchConditions = { ...searchConditions, ... this.searchConditions };
    console.log('searchConditions', lastSearchConditions);
    this.getInsurancePolices(lastSearchConditions);
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


  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchInsurancePolicy;
    this.p = pageNumber;
    this.getInsurancePolices(this.searchConditions);
  }

}
