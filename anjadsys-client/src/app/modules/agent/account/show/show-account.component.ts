import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchUser, UserAPI } from '@models/user';
import { AccountAPI, SearchAccount, AccountsAPI } from '@models/account';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AgentService } from '../../agent.service';
import { InsurancePolicesAPI, SearchInsurancePolicy } from '@models/insurancepolicy';
import {
  InsurancePolicyComponent
} from '@shared/components/insurance-policy-modal/insurance-policy.component';

@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrls: ['./show-account.component.scss']
})
export class ShowAccountComponent implements OnInit, OnDestroy {

  accounts: AccountAPI[] = [];
  agentBalance: number | undefined;
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  private currentDate = new Date();

  firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  private unsubscribe$ = new Subject<void>();
  agentName = JSON.parse(localStorage.getItem('user') || '');

  currency = 'شيكل';
  errorMsg: string | undefined;
  successMsg: string | undefined;
  showTop = false;
  showBottom = false;
  searchConditions: SearchAccount = {};

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    customer: false,
  };

  private searchCustomerText$ = new Subject<string>();
  spinnerCustomer$ = new BehaviorSubject<boolean>(false);

  constructor(
    private agentService: AgentService,
    private modalService: NgbModal
  ) {
    this.agentName = this.agentName.companyName;
  }

  ngOnInit(): void {
    this.getAccount(this.searchConditions);
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

  searchAccount(searchConditions: SearchAccount) {
    let lastSearchConditions = { ...searchConditions, ...this.searchConditions };
    this.getAccount(lastSearchConditions);
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

  getAccount(searchConditions: SearchAccount) {
    this.agentService.AccountsAPI.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: AccountsAPI) => {
          if (response.data) {
            this.accounts = response.data;
            this.agentBalance = response.agentBalance;
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
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchAccount;
    this.p = pageNumber;
    this.getAccount(this.searchConditions);
    console.log(pageNumber);
  }

}
