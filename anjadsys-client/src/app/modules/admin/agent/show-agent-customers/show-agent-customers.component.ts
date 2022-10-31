import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, first, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { faTimes, faTrashAlt, faUserEdit, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { SearchUser, updateUser, UserAPI } from '@models/user';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-show-agent-customers',
  templateUrl: './show-agent-customers.component.html',
  styleUrls: ['./show-agent-customers.component.scss']
})
export class ShowAgentCustomersComponent implements OnInit, OnDestroy {

  cancelInput = faTimes;
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  userMinus = faUserMinus;

  selectedAgentName: string | undefined;
  selectedAgent: UserAPI | undefined;
  unsubscribe$ = new Subject<void>();
  customers: UserAPI[] = [];
  successMsg: string | undefined;
  successMsgForAddUser: string | undefined;
  errorMsg: string | undefined;
  errorMsgForAddUser: string | undefined;
  spinnerCustomer: boolean = false;

  TIMEOUTMILISEC = 7000;
  private searchUserText$ = new Subject<string>();
  private  searchConditions: SearchUser = {} as SearchUser;

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  allCustomers: UserAPI[] = [];
  selectedCustomer: UserAPI | undefined;
  addCustomerToAgentForm = this.fb.group({
    customerId: [ '', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCustomersById(this.searchConditions);
    this.searchAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  loadCustomersById(searchConditions: SearchUser): void {
    this.route.paramMap
      .pipe(first())
      .subscribe({
        next: params => {
          this.selectedAgent = { id: params.get('id') } as UserAPI;
          if (!this.selectedAgent) { this.router.navigate(['admin/agent/show-agents']); }

          this.selectedAgentName = params.get('fullname') || undefined;
          searchConditions = { ...searchConditions, agentID: this.selectedAgent.id! };
          this.adminService.UsersAPIs.list(searchConditions)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: response => {
                if (response.data) {
                  this.customers = response.data;
                  this.pagination.total = response.total;
                }
                console.log(response.data);
              },
              error: err => console.log(err)
            });
        }
      });
  }

  goToUserEdit(id: string): void {
    this.router.navigate([ '/admin/user/edit/', id ]);
  }

  deleteUser(user: UserAPI) {
    if (!user) { return; }

    const yes = confirm(`هل تريد حذف الزبون ${ user.username } ورقم حسابه ${ user.id } بشكل نهائي؟`);
    if (!yes) { return; }

    this.adminService.UsersAPIs.delete(user.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            this.loadCustomersById(this.searchConditions);
          }
        },
        error: err => console.log(err)
      });
  }

  addCustomerToAgent = (form: FormGroupDirective): void => {
    if (this.addCustomerToAgentForm.invalid) { return; }

    let formObj: updateUser = {} as updateUser;
    const userID = this.selectedCustomer?.id!;
    formObj.agentId = this.selectedAgent?.id;

    this.adminService.UsersAPIs.update(userID, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsgForAddUser = response.message;
            setTimeout(() => this.successMsgForAddUser = undefined, this.TIMEOUTMILISEC);
            this.loadCustomersById(this.searchConditions);
            this.resetForm(form);
          }
          console.log(response);
        },
        error: err => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsgForAddUser = err.error.message;
            setTimeout(() => this.errorMsgForAddUser = undefined, this.TIMEOUTMILISEC);
          }
        }
      });

    console.log(formObj);
  };

  removeCustomerFromAgent(user: UserAPI) {
    if (!user) { return; }

    const yes = confirm(`هل تريد ازالة الزبون ${ user.username } ورقم حسابه ${ user.id } من قائمة الزبائن للوكيل ${ this.selectedAgentName }`);
    if (!yes) { return; }

    let formObj: updateUser = {} as updateUser;
    let userID = user.id!;
    formObj.agentId = null;

    this.adminService.UsersAPIs.update(userID, formObj)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.successMsg = response.message;
            setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
            this.loadCustomersById(this.searchConditions);
          }
          console.log(response);
        },
        error: err => {
          console.error(err.error);
          if (err?.error?.message) {
            this.errorMsg = err.error.message;
            setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
          }
        }
      });

    console.log(formObj);
  }

  searchCustomer(event: Event) {
    console.log(event);
    if (!(event instanceof KeyboardEvent)) {
      event.preventDefault();
      event.stopPropagation();
      this.selectedCustomer = this.allCustomers?.filter(customer =>
        customer.id === this.formCont('customerId')?.value
      )[0];
      return;
    }

    let carTypeTxt = ((event.target as HTMLInputElement).value)?.trim();
    if (carTypeTxt) { this.searchUserText$.next(carTypeTxt); }
  }

  searchAPI() {
    this.searchUserText$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.spinnerCustomer = true),
        switchMap(text =>
          this.adminService.UsersAPIs.list({ username: text, role: 'customer',
            skipLoadingInterceptor: true } as SearchUser))
      ).subscribe({
        next: response => {
          if (response.data) {
            this.allCustomers = response.data;
          }
          this.spinnerCustomer = false;
          console.log(response);
        },
        error: err => {
          this.spinnerCustomer = false;
          console.log(err);
        }
      });
  }

  resetForm(ngform: FormGroupDirective) {
    this.addCustomerToAgentForm.reset();
    this.addCustomerToAgentForm.updateValueAndValidity();
    this.addCustomerToAgentForm.markAsUntouched();
    this.selectedCustomer = undefined;
    ngform.resetForm();
  }

  formCont(controlName: string): any {
    return this.addCustomerToAgentForm.controls[controlName];
  }

  cancelCustomerInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedCustomer = undefined;
    this.formCont('customerId').setValue('');
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchUser;
    this.p = pageNumber;
    this.loadCustomersById(this.searchConditions);
    console.log(pageNumber);
  }

}
