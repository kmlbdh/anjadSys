import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { SearchUser, UserAPI } from '../../../../model/user';
import { SearchInsurancePolicy, InsurancePolicesAPI } from '../../../../model/insurancepolicy';
import { faEdit, faEnvelopeOpenText, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { SearchOtherServices, OtherServiceAPI } from '../../../../model/otherservices';
import {
  OtherServiceModalComponent
} from '../../../../../shared/components/other-service-modal/other-service-modal.component';
import {
  InsurancePolicyComponent
} from '../../../../../shared/components/insurance-policy-modal/insurance-policy.component';

@Component({
  selector: 'app-show-otherservices',
  templateUrl: './show-otherservices.component.html',
  styleUrls: ['./show-otherservices.component.scss']
})
export class ShowOtherservicesComponent implements OnInit, OnDestroy {

  otherServices: OtherServiceAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  openIcon = faEnvelopeOpenText;
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;
  cancelInput = faTimes;

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

  currency = 'شيكل';
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchOtherServices = {} as SearchOtherServices;
  showTop = false;
  showBottom = false;

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    customer: false,
    insurancePolicy: false,
  };

  private searchCustomerText$ = new Subject<string>();

  fileStatusArr = [ 'مفتوح', 'مغلق' ];

  searchOtherServiceForm = this.fb.group({
    otherServiceID: [''],
    insurancePolicyId: [''],
    customerID: [''],
    fileStatus: [''],
    serviceKind: [''],
    startDate: [this.firstDayOfMonth.toISOString().substring(0, 10)],
    endDate: [this.lastDayOfMonth.toISOString().substring(0, 10)],
  });

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getOtherServices(this.searchConditions);
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCustomerAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.lightlist(
      { username: val, skipLoadingInterceptor: true, role: 'customer' } as SearchUser);

    this.searchCustomerText$
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
    this.formCont('customerID').setValue('');
  }

  searchOtherService(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchOtherServices = {} as SearchOtherServices;
    keys.forEach(key => {
      searchConditions[key] = this.searchOtherServiceForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.getOtherServices(searchConditions);
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

  openOtherService(otherService: OtherServiceAPI) {
    const refModal = this.modalService.open(OtherServiceModalComponent, this.modalOptions);
    refModal.componentInstance.modalOtherService = otherService;
    refModal.result.then(result => {
      this.closeResult = `Closed with: ${ result }`;
    }, reason => {
      this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
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

  getOtherServices(searchConditions: SearchOtherServices) {
    this.adminService.OtherServicesAPIs.show(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          if (response.data) {
            this.otherServices = response.data;
            this.pagination.total = response.total;
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  deleteOtherService(otherService: any) {
    if (!otherService) { return; }

    const yes = confirm(`هل تريد حذف الخدمة رقم ${ otherService.id } باسم ${ otherService.name }`);
    if (!yes) { return; }

    this.adminService.OtherServicesAPIs.delete(otherService.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            this.getOtherServices(this.searchConditions);
          }
          console.log(response);
        },
        error: err => console.log(err)
      });
  }

  goToOtherServiceEdit(id: number) {
    this.router.navigate([ 'admin/otherservices/edit', id ]);
  }

  formCont(controlName: string) {
    return this.searchOtherServiceForm.controls[controlName];
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchOtherServices;
    this.p = pageNumber;
    this.getOtherServices(this.searchConditions);
    console.log(pageNumber);
  }

  showSearch() {
    this.showTop = !this.showTop;
    setTimeout(() => this.showBottom = !this.showBottom, 40);
  }

}
