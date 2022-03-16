import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountAPI, AccountsAPI, SearchAccount } from '../../../../model/account';
import { UserAPI, SearchUser } from '../../../../model/user';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject, takeUntil, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { InsurancePolicesAPI, InsurancePolicyAPI, SearchInsurancePolicy } from '../../../../model/insurancepolicy';
import { ServiceAccidentAPI, ServicePolicyAPI } from '../../../../model/service';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { AccidentAPI, AccidentsAPI, SearchAccident } from 'src/app/modules/core/model/accident';

@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrls: ['./show-account.component.scss']
})
export class ShowAccountComponent implements OnInit, OnDestroy {
  accounts: AccountAPI[] = [];
  selectedAgent: UserAPI | undefined;
  selectedSupplier: UserAPI | undefined;
  agents: UserAPI[] = [];
  suppliers: UserAPI[] = [];
  showPercentage = true;
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
    supplier: false,
  };

  private searchCustomerText$ = new Subject<string>();
  private searchSupplierText$ = new Subject<string>();

  modalInsurancePolicy: {
    customer: UserAPI,
    insurancePolicy: InsurancePolicyAPI,
    services: ServicePolicyAPI[]
  } = {
    customer: {} as UserAPI,
    insurancePolicy: {} as InsurancePolicyAPI,
    services: [] as ServicePolicyAPI[]
  };


  modalAccident: {
    customer: UserAPI,
    accident: AccidentAPI,
    services: ServiceAccidentAPI[]
  } = {
    customer: {} as UserAPI,
    accident: {} as AccidentAPI,
    services: [] as ServiceAccidentAPI[]
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
    agentID: [''],
    supplierID: [''],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.getAccount(this.searchConditions);
    this.searchCustomerAPI();
    this.searchSupplierAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
      { username: val, skipLoadingInterceptor: true, role: 'agent' } as SearchUser);

      this.searchCustomerText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinner.customer = true),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
            this.agents = response.data;
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

  searchSupplierAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
      { username: val, skipLoadingInterceptor: true, role: 'supplier' } as SearchUser);

      this.searchSupplierText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        tap(() => this.spinner.supplier = true),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
            this.suppliers = response.data;
          }
          this.spinner.supplier = false;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.supplier = false;
        }
      });
  }

  searchCustomer(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('agentID')?.value;
      this.selectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchSupplier(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('supplierID')?.value;
      this.selectedSupplier = this.mouseEventOnSearch(event, this.suppliers!, controlValue) as UserAPI;
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.searchSupplierText$.next(typeTxt);
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
    this.selectedAgent = undefined;
    this.formCont('agentID').setValue('');
  }

  cancelSupplierInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedSupplier = undefined;
    this.formCont('supplierID').setValue('');
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
    this.adminService.listInsurancePolicy(searchCondition)
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
    this.adminService.listAccounts(searchConditions)
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

  openAccident(content: any, accidentId: number) {
    let searchCondition: SearchAccident = { accidentID: accidentId };
    this.adminService.listAccidents(searchCondition)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: AccidentsAPI) => {
        if(response.data){
          this.modalAccident.customer = response.data[0].Customer;
          this.modalAccident.accident = response.data[0];
          this.modalAccident.services = response.data[0].ServiceAccidents!;

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
    this.searchConditions = { skip: skip } as SearchAccount;
    this.p = pageNumber;
    this.getAccount(this.searchConditions);
    console.log(pageNumber);
  }

  printPage(): void{
    window.print()
  }

}
