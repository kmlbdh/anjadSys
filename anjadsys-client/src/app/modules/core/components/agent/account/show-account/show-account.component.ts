import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { SearchUser, UserAPI } from 'src/app/modules/core/model/user';
import { AccountAPI, SearchAccount, AccountsAPI } from '../../../../model/account';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { AgentService } from '../../agent.service';
import { Router } from '@angular/router';
import { InsurancePolicesAPI, InsurancePolicyAPI, SearchInsurancePolicy } from 'src/app/modules/core/model/insurancepolicy';
import { ServicePolicyAPI } from 'src/app/modules/core/model/service';

@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrls: ['./show-account.component.scss']
})
export class ShowAccountComponent implements OnInit, OnDestroy {
  accounts: AccountAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  trashIcon = faTrashAlt;
  carEditIcon = faEdit;
  cancelInput = faTimes;

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

  modalInsurancePolicy: {
    customer: UserAPI,
    insurancePolicy: InsurancePolicyAPI,
    services: ServicePolicyAPI[]
  } = {
    customer: {} as UserAPI,
    insurancePolicy: {} as InsurancePolicyAPI,
    services: [] as ServicePolicyAPI[]
  };
  //   customer: UserAPI,
  //   accident: AccidentAPI,
  //   services: ServiceAccidentAPI[]
  // } = {
  //   customer: {} as UserAPI,
  //   accident: {} as AccidentAPI,
  //   services: [] as ServiceAccidentAPI[]
  // };

  searchAccountForm = this.fb.group({
    accountId: [''],
    insurancePolicyId: [''],
    // customerID: [''],
  });

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private router: Router,
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

  searchCustomerAPI(){
    let callback = (val: string) => this.agentService.listLightUsers(
      { username: val, skipLoadingInterceptor: true } as SearchUser);

      this.searchCustomerText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
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

  searchCustomer(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('customerID')?.value;
      this.selectedCustomer = this.mouseEventOnSearch(event, this.customers!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.customer = true;
      this.searchCustomerText$.next(typeTxt);
    }
  }

  mouseEventOnSearch(event: Event, array: any[], controlValue: any): UserAPI{
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

  searchAccount(form: FormGroupDirective){
    if(form.invalid) return;
    let keys = Object.keys(form.value);
    let searchConditions: SearchAccount = {}
    keys.forEach(key => {
      searchConditions[key] = this.searchAccountForm.get(key)?.value;
      if(!searchConditions[key] || searchConditions[key] === '')
        delete searchConditions[key];
    });
    console.log('searchConditions', searchConditions);
    this.getAccount(searchConditions);
  }

  open(content: any, insurancePolicyId: number) {
    let searchCondition: SearchInsurancePolicy = { insurancePolicyId: insurancePolicyId };
    this.agentService.listInsurancePolicy(searchCondition)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: InsurancePolicesAPI) => {
        if(response.data){
          this.modalInsurancePolicy.customer = response.data[0].Customer;
          this.modalInsurancePolicy.insurancePolicy = response.data[0];
          this.modalInsurancePolicy.services = response.data[0].ServicePolicies;

          this.modalService.open(content, this.modalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
      return  `with: ${reason}`;
    }
  }

  getAccount(searchConditions: SearchAccount){
    this.agentService.listAccounts(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: AccountsAPI) => {
        if(response.data){
          this.accounts = response.data;
          this.pagination.total = response.total;
        }
      },
      error: (error: any) => console.log(error)
    });
  }

  // deleteAccount(account: AccountAPI){
  //   if(!account) return;

  //   const yes = confirm(`هل تريد حذف الحركة المالية رقم ${account.id} للزبون ${account.Agent.username}`);
  //   if(!yes) return;

  //   this.agentService.deleteAccount(account.id)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe({
  //     next: response => {
  //       if(response.data)
  //         this.successMsg = response.message;

  //       this.getAccidents(this.searchConditions);
  //       console.log(response);
  //     },
  //     error: (err: any) => console.log(err)
  //   })
  // }

  goToAccountEdit(id: number){
    this.router.navigate(['agent/account/edit', id]);
  }

  formCont(controlName: string){
    return this.searchAccountForm.controls[controlName];
  }

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchAccount;
    this.p = pageNumber;
    this.getAccount(this.searchConditions);
    console.log(pageNumber);
  }

  printPage(): void{
    window.print()
  }

}
