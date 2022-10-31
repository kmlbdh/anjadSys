import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { CarAPI, CarsAPI, SearchCar } from 'src/app/modules/core/model/car';
import { SearchUser, UserAPI } from '@models/user';
import { AgentService } from '../../../agent.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CarModalComponent } from '@shared/components/car-modal/car-modal.component';

@Component({
  selector: 'app-show-car-customer',
  templateUrl: './show-car-customer.component.html',
  styleUrls: ['./show-car-customer.component.scss']
})
export class ShowCarCustomerComponent implements OnInit, OnDestroy {

  cars: CarAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

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
  };

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  private searchCustomerText$ = new Subject<string>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCar = {};

  searchCarForm = this.fb.group({
    customerID: [''],
    carNumber: [''],
    serialNumber: [''],
  });

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getCars(this.searchConditions);
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
      this.searchCarForm.get('agentID')?.disable();
      return;
    }

    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.spinner.customer = true;
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

  searchCar(form: FormGroupDirective) {
    if (form.invalid) { return; }
    let keys = Object.keys(form.value);
    let searchConditions: SearchCar = {} as SearchCar;
    keys.forEach(key => {
      searchConditions[key] = this.searchCarForm.get(key)?.value;
      if (!searchConditions[key] || searchConditions[key] === '') { delete searchConditions[key]; }
    });
    console.log('searchConditions', searchConditions);
    this.getCars(searchConditions);
  }

  getCars(searchConditions: SearchCar) {
    this.agentService.CarsAPIs.show(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: CarsAPI) => {
          if (response.data) {
            this.cars = response.data;
            this.pagination.total = response.total;
          }
        },
        error: (error: any) => console.log(error)
      });
  }

  open(car: any) {
    const refModal = this.modalService.open(CarModalComponent, this.modalOptions);
    refModal.componentInstance.carDetails = car;
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

  formCont(controlName: string) {
    return this.searchCarForm.controls[controlName];
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchCar;
    this.p = pageNumber;
    this.getCars(this.searchConditions);
    console.log(pageNumber);
  }

}
