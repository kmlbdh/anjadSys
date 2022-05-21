import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchUser, UsersAPI, UserAPI, updateUser } from '../../../../model/user';
import { faTrashAlt, faPeopleCarry, faMoneyBillAlt, faCopy, faUsers, faEdit, faUserSlash, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})

export class ShowUsersComponent implements OnInit, OnDestroy {
  trashIcon = faTrashAlt;
  userEditIcon = faEdit;
  deactivateUserIcon = faUserSlash;
  activateUserIcon = faUserCheck;
  addAgentLimitIcon = faMoneyBillAlt;
  agentLimitsListIcon = faCopy;
  customersIcon = faUsers;
  supplierPartsIcon = faPeopleCarry;

  users: UserAPI[] = [];
  usersToBeAdded: UserAPI[] = [];

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  TIMEOUTMILISEC = 7000;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchUser = {};

  private unsubscribe$ = new Subject<void>();

  pageTitle!: string;
  activeAgentLimits: boolean = false;
  activeSuppliers: boolean = false;

  rolesLang:{
    [index: string]: string;
  } = {
    'agent': 'وكيل',
    'admin': 'مدير',
    'supplier':  'مورد',
    'customer': 'زبون'
  };

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.pageTitle = data['title'];
        this.activeAgentLimits = (!!data['role'] && data['role'] === "agent");
        this.activeSuppliers = (!!data['role'] && data['role'] === "supplier");
        this.searchConditions['role'] = data['role'];
        this.getUsers(this.searchConditions);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

//TODO wrong response type
  getUsers(searchConditions: SearchUser){
    this.adminService.UsersAPIs.list(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: UsersAPI) => {
        if(response.data){
           this.users = response.data;
           this.pagination.total = response.total;
        }

      },
      error: (error) => console.log(error)
    })
  }

  deleteUser(user: any){
    if(!user) return;

    const yes = confirm(`هل تريد حذف المستخدم ${user.username} ورقم حسابه ${user.id}`);
    if(!yes) return;

    this.adminService.UsersAPIs.delete(user.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response) => {
        if(response.data){
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
          this.getUsers(this.searchConditions);
        }
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message){
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
        }
      }
    });
  }

  unblockUser(user: UserAPI){
    if(!user) return;

    const yes = confirm(`هل تريد تفعيل حساب المستخدم ${user.username} ورقم حسابه ${user.id}`);
    if(!yes) return;

    this.sharedBlockUser(user, false);
  }


  blockUser(user: UserAPI) {
    if(!user) return;

    const yes = confirm(`هل تريد تعطيل حساب المستخدم ${user.username} ورقم حسابه ${user.id}`);
    if(!yes) return;

    this.sharedBlockUser(user, true);
  }

  sharedBlockUser(user: UserAPI, blocked: boolean){
    this.adminService.UsersAPIs.update(user.id, {blocked: blocked} as updateUser)
    .subscribe({
      next: (response) => {
        if(response.data){
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);
          this.getUsers(this.searchConditions);
        }
        console.log(response);
      },
      error: (err) => {
        console.error(err.error);
        if(err?.error?.message){
          this.errorMsg = err.error.message;
          setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
        }
      }
    });
  }

  trackById(index: number, el: any){
    return el.id;
  }

  goToUserEdit(id: string){
    this.router.navigate(['admin/user/edit', id]);
  }

  goToAddAgentLimits(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.companyName}`;
    this.router.navigate([`admin/agent/add-agent-limit`, { id: agent.id, fullname }]);
  }

  goToListAgentLimits(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.companyName}`;
    this.router.navigate([`admin/agent/show-agent-limits/${agent.id}`, {fullname}]);
  }

  goToListCustomers(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.companyName}`;
    this.router.navigate([`admin/agent/show-agent-customers/${agent.id}`, {fullname}]);
  }

  goToSupplierAccount(supplier: UserAPI){
    const fullname = `${supplier.username} | ${supplier.companyName}`;
    this.router.navigate([`admin/supplier/account/${supplier.id}`, { fullname }]);
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchUser;
    this.p = pageNumber;
    this.getUsers(this.searchConditions);
    console.log(pageNumber);
  }
}
