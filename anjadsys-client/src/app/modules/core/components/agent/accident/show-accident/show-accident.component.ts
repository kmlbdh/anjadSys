import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { AccidentAPI, AccidentsAPI, SearchAccident } from 'src/app/modules/core/model/accident';
import { SearchUser, UserAPI } from 'src/app/modules/core/model/user';
import { AgentService } from '../../agent.service';
import { ServiceAccidentAPI } from '../../../../model/service';
import { NgbModalOptions, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-show-accident',
  templateUrl: './show-accident.component.html',
  styleUrls: ['./show-accident.component.scss']
})
export class ShowAccidentComponent implements OnInit, OnDestroy {
  accidents: AccidentAPI[] = [];
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
  };

  private searchCustomerText$ = new Subject<string>();

  modalAccident: {
    customer: UserAPI,
    accident: AccidentAPI,
    services: ServiceAccidentAPI[]
  } = {
    customer: {} as UserAPI,
    accident: {} as AccidentAPI,
    services: [] as ServiceAccidentAPI[]
  };

  searchAccidentForm = this.fb.group({
    accidentID: [''],
    accidentPlace: [''],
    accidentDate: [''],
    registerAccidentDate: [''],
    driverName: [''],
    driverIdentity: [''],
    regionID: [''],
    customerID: [''],
    carID: [''],
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
    this.getAccidents(this.searchConditions);
    this.searchCustomerAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCustomerAPI(){
    let callback = (val: string) => this.agentService.UsersAPI.lightList(
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

  searchAccident(form: FormGroupDirective){
    if(form.invalid) return;
    let keys = Object.keys(form.value);
    let searchConditions: SearchAccident = {}
    keys.forEach(key => {
      searchConditions[key] = this.searchAccidentForm.get(key)?.value;
      if(!searchConditions[key] || searchConditions[key] === '')
        delete searchConditions[key];
    });
    console.log('searchConditions', searchConditions);
    this.getAccidents(searchConditions);
  }

  open(content: any, accidentId: number) {
    let searchCondition: SearchAccident = { accidentID: accidentId };
    this.agentService.AccidentsAPI.list(searchCondition)
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getAccidents(searchConditions: SearchAccident){
    this.agentService.AccidentsAPI.list(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: AccidentsAPI) => {
        if(response.data){
          this.accidents = response.data;
          this.pagination.total = response.total;
        }
      },
      error: (error: any) => console.log(error)
    });
  }

  // deleteAccident(accident: AccidentAPI){
  //   if(!accident) return;

  //   const yes = confirm(`هل تريد حذف بلاغ حادث رقم ${accident.id} للزبون ${accident.Customer.username}`);
  //   if(!yes) return;

  //   this.agentService.deleteAccident(accident.id)
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

  goToAccidentEdit(id: number){
    this.router.navigate(['agent/accident/edit', id]);
  }

  formCont(controlName: string){
    return this.searchAccidentForm.controls[controlName];
  }

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchAccident;
    this.p = pageNumber;
    this.getAccidents(this.searchConditions);
    console.log(pageNumber);
  }

  printPage(): void{
    window.print()
  }

}
