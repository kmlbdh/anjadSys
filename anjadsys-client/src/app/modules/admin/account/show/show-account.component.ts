import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountAPI, AccountsAPI, SearchAccount } from '@models/account';
import { UserAPI, SearchUser } from '@models/user';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  Subject,
  takeUntil,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
  BehaviorSubject
} from 'rxjs';
import { InsurancePolicesAPI, SearchInsurancePolicy } from '@models/insurancepolicy';
import { AgentLimitsArrayAPI, SearchAgentLimits } from '@models/agentlimits';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import {
  AgentLimitsModalComponent
} from '@shared/components/agent-limits-modal/agent-limits-modal.component';
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
  selectedAgent: UserAPI | undefined;
  selectedSupplier: UserAPI | undefined;
  agents: UserAPI[] = [];
  suppliers: UserAPI[] = [];

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  private unsubscribe$ = new Subject<void>();

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

  spinnerAgent$ = new BehaviorSubject<boolean>(false);
  spinnerSupplier$ = new BehaviorSubject<boolean>(false);

  private searchAgentText$ = new Subject<string>();
  private searchSupplierText$ = new Subject<string>();

  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAccount(this.searchConditions);
    this.searchAgentAPI();
    this.searchSupplierAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSelectedSupplier(event: UserAPI | undefined) {
    if (event) { this.selectedSupplier = event; }
  }

  getSelectedAgent(event: UserAPI | undefined) {
    if (event) { this.selectedAgent = event; }
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

  searchSupplierAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.lightlist(
      { username: val, skipLoadingInterceptor: true, role: 'supplier' } as SearchUser);

    this.searchSupplierText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinnerSupplier$.next(true)),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.suppliers = response.data;
          }
          this.spinnerSupplier$.next(false);
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinnerSupplier$.next(false);
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

  searchSupplier(event: Event): void {
    // console.log(event);

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchSupplierText$.next(typeTxt);
    }
  }

  searchAccount(searchConditions: SearchAccount) {
    let lastSearchConditions = { ...searchConditions, ...this.searchConditions };
    // this.searchConditions = lastSearchConditions;
    this.getAccount(lastSearchConditions);
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

  openAgentLimits(agentLimitId: number) {
    let searchCondition: SearchAgentLimits = { accountId: agentLimitId } as SearchAgentLimits;
    this.adminService.AgentLimitsAPIs.listLimits(searchCondition)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: AgentLimitsArrayAPI) => {
          if (response.data) {
            const refModal = this.modalService.open(AgentLimitsModalComponent, this.modalOptions);
            refModal.componentInstance.modalAgentLimits = response.data[0];
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
    this.adminService.AccountsAPIs.list(searchConditions)
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

  goToAccountEdit(id: number) {
    this.router.navigate([ 'agent/account/edit', id ]);
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

  printPage(): void {
    window.print();
  }

}
