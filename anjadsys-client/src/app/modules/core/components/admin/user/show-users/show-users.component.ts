import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchUser, UsersAPI, UserAPI, updateUser } from '../../../../model/user';
import { faTrashAlt, faPeopleCarry, faMoneyBillAlt, faCopy, faUsers, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroupDirective, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})

export class ShowUsersComponent implements OnInit, OnDestroy {
  users: UserAPI[] = [];
  usersToBeAdded: UserAPI[] = [];
  trashIcon = faTrashAlt;
  userEditIcon = faEdit;
  addAgentLimitIcon = faMoneyBillAlt;
  agentLimitsListIcon = faCopy;
  customersIcon = faUsers;
  supplierPartsIcon = faPeopleCarry;

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
    this.adminService.showUsers(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: UsersAPI) => this.users = response.data,
      error: (error) => console.log(error)
    })
  }

  deleteUser(user: any){
    if(!user) return;

    const yes = confirm(`هل تريد حذف المستخدم ${user.username} ورقم حسابه ${user.id}`);
    if(!yes) return;

    this.adminService.deleteUser(user.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getUsers(this.searchConditions);
        console.log(response);
      },
      error: err => console.log(err)
    })
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

  goToSupplierPartsList(supplier: UserAPI){
    const fullname = `${supplier.username} | ${supplier.companyName}`;
    this.router.navigate([`admin/list-supplier-parts/${supplier.id}`, { fullname }]);
  }

}
