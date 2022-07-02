import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTimes, faTrashAlt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AccidentAPI, SearchAccident, AccidentsAPI } from '@models/accident';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SearchUser, UserAPI } from '@models/user';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
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

  openIcon = faEnvelopeOpenText;
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

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchAccident = {};

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

  TIMEOUTMILISEC = 7000;

  searchAccidentForm = this.fb.group({
    accidentID: [''],
    accidentPlace: [''],
    accidentDate: [''],
    registerAccidentDate: [''],
    driverName: [''],
    driverIdentity: [''],
    regionID: [''],
    customerID: [''],
    agentID: [''],
    carID: [''],
  });

  constructor(
    private fb: FormBuilder,
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

  searchCustomerAPI() {
    let callback = (val: string) => this.adminService.UsersAPIs.lightlist(
      { username: val, skipLoadingInterceptor: true } as SearchUser);

    this.searchCustomerText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        filter(txt => txt !== ''),
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
      this.searchAccidentForm.get('agentID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.spinner.customer = true;
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
        switchMap(callback)
      ).subscribe({
        next: (response: any) => {
          if (response.data) {
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

  searchAgent(event: Event): void {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      const controlValue = this.formCont('agentID')?.value;
      this.selectedAgent = this.mouseEventOnSearch(event, this.agents!, controlValue) as UserAPI;
      this.searchAccidentForm.get('customerID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.spinner.agent = true;
      this.searchAgentText$.next(typeTxt);
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
    this.formCont('agentID').enable();
  }

  cancelAgentInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedAgent = undefined;
    this.formCont('agentID').setValue('');
    this.formCont('customerID')?.enable();
  }

  searchAccident(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchAccident = {};
    keys.forEach(key => {
      searchConditions[key] = this.searchAccidentForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '')
      { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.getAccidents(searchConditions);
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

  formCont(controlName: string) {
    return this.searchAccidentForm.controls[controlName];
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
