import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap, BehaviorSubject } from 'rxjs';
import { AdminService } from '../../admin.service';
import { SearchUser, UserAPI } from '@models/user';
import { SearchInsurancePolicy, InsurancePolicesAPI } from '@models/insurancepolicy';
import { SearchOtherServices, OtherServiceAPI } from '@models/otherservices';
import {
  OtherServiceModalComponent
} from '@shared/components/other-service-modal/other-service-modal.component';
import {
  InsurancePolicyComponent
} from '@shared/components/insurance-policy-modal/insurance-policy.component';

@Component({
  selector: 'app-show-otherservices',
  templateUrl: './show-otherservices.component.html',
  styleUrls: ['./show-otherservices.component.scss']
})
export class ShowOtherservicesComponent implements OnInit, OnDestroy {

  otherServices: OtherServiceAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

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

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  spinner = {
    insurancePolicy: false,
  };

  private searchCustomerText$ = new Subject<string>();
  spinnerCustomer$ = new BehaviorSubject<boolean>(false);

  constructor(
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

  getSelectedCustomer(event: UserAPI | undefined) {
    if (event) { this.selectedCustomer = event; }
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
        tap(() => this.spinnerCustomer$.next(true)),
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.customers = response.data;
          }
          this.spinnerCustomer$.next(false);
        },
        error: (err: any) => {
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

  searchOtherService(searchConditions: SearchOtherServices) {
    let lastSearchCondition = { ...this.searchConditions, ...searchConditions };
    this.getOtherServices(lastSearchCondition);
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

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchOtherServices;
    this.p = pageNumber;
    this.getOtherServices(this.searchConditions);
  }

}
