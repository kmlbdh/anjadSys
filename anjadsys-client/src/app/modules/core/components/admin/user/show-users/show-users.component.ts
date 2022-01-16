import { Component, OnInit } from '@angular/core';
import { SearchUser, UsersAPI, UserAPI } from '../../../../model/user';
import { faTrashAlt, faUserEdit, faPeopleCarry, faMoneyBillAlt, faCopy, faUsers } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})

export class ShowUsersComponent implements OnInit {
  users: UserAPI[] = [];
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  addAgentLimitIcon = faMoneyBillAlt;
  agentLimitsListIcon = faCopy;
  customersIcon = faUsers;
  supplierPartsIcon = faPeopleCarry;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchUser = {};

  pageTitle!: string;
  activeAgentLimits: boolean = false;
  activeSuppliers: boolean = false;
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
//TODO wrong response type
  getUsers(searchConditions: SearchUser){
    this.adminService.showUsers(searchConditions).subscribe({
      next: (response: UsersAPI) => this.users = response.data,
      error: (error) => console.log(error)
    })
  }

  deleteUser(user: any){
    if(!user) return;

    const yes = confirm(`هل تريد حذف المستخدم ${user.username} ورقم حسابه ${user._id}`);
    if(!yes) return;

    this.adminService.deleteUser(user._id).subscribe({
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
    return el._id;
  }

  goToUserEdit(id: string){
    this.router.navigate(['admin/edit-user', id]);
  }

  goToAddAgentLimits(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.nickname}`;
    this.router.navigate([`admin/add-agent-limit`, { id: agent._id, fullname }]);
  }

  goToListAgentLimits(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.nickname}`;
    this.router.navigate([`admin/show-agent-limits/${agent._id}`, {fullname}]);
  }

  goToListCustomers(agent: UserAPI){
    const fullname = `${agent.username} | ${agent.nickname}`;
    this.router.navigate([`admin/show-agent-customers/${agent._id}`, {fullname}]);
  }

  goToSupplierPartsList(supplier: UserAPI){
    const fullname = `${supplier.username} | ${supplier.nickname}`;
    this.router.navigate([`admin/list-supplier-parts/${supplier._id}`, { fullname }]);
  }
}
