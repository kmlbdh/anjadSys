import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AccidentAPI, SearchAccident, AccidentsAPI } from '@models/accident';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SearchUser, UserAPI } from '@models/user';
import { CarModalComponent } from '@shared/components/car-modal/car-modal.component';
import { AccidentModalComponent } from '@shared/components/accident-modal/accident-modal.component';

@Component({
  selector: 'app-show-accident',
  templateUrl: './show-accident.component.html',
  styleUrls: ['./show-accident.component.scss']
})
export class ShowAccidentComponent implements OnInit, OnDestroy {

  accidents: AccidentAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];
  selectedAgent: UserAPI | undefined;
  agents: UserAPI[] = [];

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  private unsubscribe$ = new Subject<void>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchAccident = {};

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  private searchCustomerText$ = new Subject<string>();
  private searchAgentText$ = new Subject<string>();

  TIMEOUTMILISEC = 7000;

  spinnerCustomer$ = new BehaviorSubject<boolean>(false);
  spinnerAgent$ = new BehaviorSubject<boolean>(false);

  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getAccidents(this.searchConditions);
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
        tap(() =>  this.spinnerCustomer$.next(true)),
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
        tap(() =>  this.spinnerAgent$.next(true)),
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

  searchAccident(searchConditions: SearchAccident) {
    let lastSearchConditions = { ...searchConditions, ...this.searchConditions };
    // console.log('searchConditions', lastSearchConditions);
    this.getAccidents(lastSearchConditions);
  }

  open(accidentId: number) {
    let searchCondition: SearchAccident = { accidentID: accidentId };
    this.adminService.AccidentsAPIs.list(searchCondition)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: AccidentsAPI) => {
          if (response.data) {
            const refModal = this.modalService.open(AccidentModalComponent, this.modalOptions);
            refModal.componentInstance.modalAccident = response.data[0];

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

  openCar(accident: AccidentAPI) {
    const refModal = this.modalService.open(CarModalComponent, this.modalOptions);
    refModal.componentInstance.carDetails = { ...accident.Car, User: accident.Customer };

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

  getAccidents(searchConditions: SearchAccident) {
    this.adminService.AccidentsAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: AccidentsAPI) => {
          if (response.data) {
            this.accidents = response.data;
            this.pagination.total = response.total;
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  deleteAccident(accident: AccidentAPI) {
    if (!accident) { return; }

    const yes = confirm(`هل تريد حذف بلاغ حادث رقم ${ accident.id } للزبون ${ accident.Customer.username }`);
    if (!yes) { return; }

    this.adminService.AccidentsAPIs.delete(accident.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.getAccidents(this.searchConditions);
          }
          console.log(response);
        },
        error: (err: any) => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });
  }

  goToAccidentEdit(id: number) {
    this.router.navigate([ 'admin/accident/edit', id ]);
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchAccident;
    this.p = pageNumber;
    this.getAccidents(this.searchConditions);
    console.log(pageNumber);
  }

}
