import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AccidentAPI, AccidentsAPI, SearchAccident } from '@models/accident';
import { SearchUser, UserAPI } from '@models/user';
import { AgentService } from '../../agent.service';
import { NgbModalOptions, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AccidentModalComponent
} from '@shared/components/accident-modal/accident-modal.component';
import { CarModalComponent } from '@shared/components/car-modal/car-modal.component';

@Component({
  selector: 'app-show-accident',
  templateUrl: './show-accident.component.html',
  styleUrls: ['./show-accident.component.scss']
})
export class ShowAccidentComponent implements OnInit, OnDestroy {

  accidents: AccidentAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  customers: UserAPI[] = [];

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  private unsubscribe$ = new Subject<void>();

  agentName = JSON.parse(localStorage.getItem('user') || '');

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchAccident = {};

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
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
    this.getAccidents(this.searchConditions);
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
    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchAccident(searchConditions: SearchAccident) {
    let lastSearchConditions = { ...searchConditions, ...this.searchConditions };
    this.getAccidents(lastSearchConditions);
  }

  open(accidentId: number) {
    let searchCondition: SearchAccident = { accidentID: accidentId };
    this.agentService.AccidentsAPI.list(searchCondition)
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
    this.agentService.AccidentsAPI.list(searchConditions)
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
