import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SearchUser, UserAPI, UsersAPI } from '@models/user';
import { AgentService } from '../../agent.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '@shared/components/user-modal/user-modal.component';
import { RegionAPI } from '@models/general';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})

export class ShowUsersComponent implements OnInit, OnDestroy {

  users: UserAPI[] = [];
  regions: RegionAPI[] = [];

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  closeResult!: string;
  modalOptions: NgbModalOptions = {
    size: 'lg',
    backdrop: 'static',
    windowClass: 'insurance-policy-modal'
  };

  TIMEOUTMILISEC = 7000;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchUser = {};

  private unsubscribe$ = new Subject<void>();

  rolesLang:{
    [index: string]: string;
  } = {
      'supplier':  'مورد',
      'customer': 'زبون'
    };
  roles = Object.entries(this.rolesLang);

  constructor(
    private agentService: AgentService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getUsers(this.searchConditions);
    this.getRegions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //TODO wrong response type
  getUsers(searchConditions: SearchUser) {
    this.users = [];
    this.pagination.total = 0;
    this.agentService.UsersAPI.show(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: UsersAPI) => {
          if (response.data && response.data.length) {
            this.users = response.data;
            this.pagination.total = response.total;
          }
        },
        error: error => console.log(error)
      });
  }

  searchUser(searchConditions: SearchUser) {
    let lastSearchCondition = { ...this.searchConditions, ...searchConditions };
    this.getUsers(lastSearchCondition);
  }

  getRegions() {
    this.agentService.GeneralAPIs.regions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) { this.regions = response.data; }
        }
      });
  }

  open(user: UserAPI) {
    const refModal = this.modalService.open(UserModalComponent, this.modalOptions);
    refModal.componentInstance.customerDetails = user;
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

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchUser;
    this.p = pageNumber;
    this.getUsers(this.searchConditions);
    console.log(pageNumber);
  }

}
