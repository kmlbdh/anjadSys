import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchUser, UserAPI } from '@models/user';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject, first, takeUntil, debounceTime, distinctUntilChanged, filter, tap, switchMap, BehaviorSubject } from 'rxjs';
import { EndorsementAPI, SearchEndorsement } from '@models/endorsement';
import { AgentService } from '../../agent.service';
import { ActivatedRoute } from '@angular/router';
import { InsurancePolicesAPI, SearchInsurancePolicy } from '@models/insurancepolicy';
import { InsurancePolicyComponent } from '@shared/components/insurance-policy-modal/insurance-policy.component';
import { EndorsementModalComponent } from '@shared/components/endorsement-modal/endorsement-modal.component';
import { CarModalComponent } from '@shared/components/car-modal/car-modal.component';
import { CarAPI } from '@models/car';

@Component({
  selector: 'app-show-endorsements',
  templateUrl: './show-endorsements.component.html',
  styleUrls: ['./show-endorsements.component.scss']
})
export class ShowEndorsementsComponent implements OnInit, OnDestroy {

  endorsements: EndorsementAPI[] = [];
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
  searchConditions: SearchEndorsement = {} as SearchEndorsement;
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

  endorsementTypeArray = ['نقل ملكية'];

  spinnerCustomer$ = new BehaviorSubject<boolean>(false);

  constructor(
    private agentService: AgentService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getOptionalParams();
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getSelectedCustomer(event: UserAPI | undefined) {
    if (event) { this.selectedCustomer = event; }
  }

  getOptionalParams() {
    this.route.paramMap
      .pipe(first())
      .subscribe({
        next: params => {
          const insurancePolicyId = params.get('insurancePolicyId');
          if (insurancePolicyId != null && insurancePolicyId != '' && Number(insurancePolicyId)) {
            this.searchConditions.insurancePolicyId = Number(insurancePolicyId);
          }
        },
        complete: () => this.getEndorsements(this.searchConditions)
      });
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
    let typeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (typeTxt && typeTxt !== '') {
      this.searchCustomerText$.next(typeTxt);
    }
  }

  searchEndorsement(searchConditions: SearchEndorsement) {
    let lastSearchConditions = { ...searchConditions, ...this.searchConditions };
    this.getEndorsements(lastSearchConditions);
  }

  open(insurancePolicyId: number) {
    let searchCondition: SearchInsurancePolicy = { insurancePolicyId: insurancePolicyId };
    this.agentService.InsurancePolicesAPI.list(searchCondition)
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

  openCar(car: CarAPI, User: UserAPI) {
    const refModal = this.modalService.open(CarModalComponent, this.modalOptions);
    refModal.componentInstance.carDetails = { ...car, User };

    refModal.result.then(result => {
      this.closeResult = `Closed with: ${ result }`;
    }, reason => {
      this.closeResult = `Dismissed ${ this.getDismissReason(reason) }`;
    });
  }

  openEndorsement(endorsement: EndorsementAPI) {
    const refModal = this.modalService.open(EndorsementModalComponent, this.modalOptions);
    refModal.componentInstance.modalEndorsement = endorsement;
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

  getEndorsements(searchConditions: SearchEndorsement) {
    this.agentService.EndorsementsAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          if (response.data) {
            this.endorsements = response.data;
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
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchEndorsement;
    this.p = pageNumber;
    this.getEndorsements(this.searchConditions);
    console.log(pageNumber);
  }

}
