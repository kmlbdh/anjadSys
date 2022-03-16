import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchInsurancePolicy, InsurancePolicyAPI, InsurancePolicesAPI } from '../../../../model/insurancepolicy';
import { AdminService } from '../../admin.service';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ServicePolicyAPI } from 'src/app/modules/core/model/service';
import { SearchUser, UserAPI } from 'src/app/modules/core/model/user';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

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

  trashIcon = faTrashAlt;
  carEditIcon = faEdit;
  cancelInput = faTimes;

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    customer: false,
    agent: false
  };

  private searchCustomerText$ = new Subject<string>();
  private searchAgentText$ = new Subject<string>();

  modalInsurancePolicy: {
    customer: UserAPI,
    insurancePolicy: InsurancePolicyAPI,
    services: ServicePolicyAPI[]
  } = {
    customer: {} as UserAPI,
    insurancePolicy: {} as InsurancePolicyAPI,
    services: [] as ServicePolicyAPI[]
  };

  currency = 'شيكل';
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchInsurancePolicy = {};

  searchInsurancePolicyForm = this.fb.group({
    insurancePolicyId: [''],
    customerID: [''],
    carID: [''],
    agentID: [''],
  });

    constructor(
      private fb: FormBuilder,
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

  searchCustomerAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
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
      this.searchInsurancePolicyForm.get('agentID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.customer = true;
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchAgentAPI(){
    let callback = (val: string) => this.adminService.listLightUsers(
      { username: val, companyName: val, skipLoadingInterceptor: true, role: 'agent' } as SearchUser);

      this.searchAgentText$.pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if(response.data){
            this.agents = response.data;
          }
          this.spinner.agent = false;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
          this.spinner.agent = false;
        }
      });
  }

  searchAgent(event: Event): void{
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      const controlValue = this.formCont('agentID')?.value;
      this.selectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      this.searchInsurancePolicyForm.get('customerID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if(typeTxt && typeTxt !== ''){
      this.spinner.agent = true;
      this.searchAgentText$.next(typeTxt);
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
    this.formCont('customerID').setValue('');
    this.searchInsurancePolicyForm.get('agentID')?.enable();
  }

  cancelAgentInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedAgent = undefined;
    this.formCont('agentID').setValue('');
    this.searchInsurancePolicyForm.get('customerID')?.enable();
  }

  searchInsurancePolicy(form: FormGroupDirective){
    if(form.invalid) return;
    let keys = Object.keys(form.value);
    let searchConditions: SearchInsurancePolicy = {}
    keys.forEach(key => {
      searchConditions[key] = this.searchInsurancePolicyForm.get(key)?.value;
      if(!searchConditions[key] || searchConditions[key] === '')
        delete searchConditions[key];
    });
    console.log('searchConditions', searchConditions);
    this.getInsurancePolices(searchConditions);
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

  getInsurancePolices(searchConditions: SearchInsurancePolicy){
    this.adminService.listInsurancePolicy(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: InsurancePolicesAPI) => {
        if(response.data){
          this.insurancePolices = response.data;
          this.pagination.total = response.total;
        }
      },
      error: (error: any) => console.log(error)
    });
  }

  deleteInsurancePolicy(insurancePolicy: InsurancePolicyAPI){
    if(!insurancePolicy) return;

    const yes = confirm(`هل تريد حذف بوليصة التأمين رقم ${insurancePolicy.id} للزبون ${insurancePolicy.Customer.username}`);
    if(!yes) return;

    this.adminService.deleteInsurancePolicy(insurancePolicy.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getInsurancePolices(this.searchConditions);
        console.log(response);
      },
      error: (err: any) => console.log(err)
    })
  }

  goToInsurancePolicyEdit(id: number){
    this.router.navigate(['admin/insurance-policy/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }

  formCont(controlName: string){
    return this.searchInsurancePolicyForm.controls[controlName];
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { skip: skip } as SearchInsurancePolicy;
    this.p = pageNumber;
    this.getInsurancePolices(this.searchConditions);
    console.log(pageNumber);
  }

  printPage(): void{
    window.print()
  }
}
