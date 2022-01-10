import { Component, OnInit } from '@angular/core';
import { AdminService, SearchUser, Users } from '../admin.service';
import { faTrashAlt, faUserEdit, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

interface ListUsers{
  _id: string,
  username: string,
  nickname: string,
  role: string,
  phone: number,
  tel: number,
  created_at: Date,
  updated_at: Date
}

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})

export class ShowUsersComponent implements OnInit {
  users: ListUsers[] = [];
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  addAgentLimitIcon = faFileInvoiceDollar;
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchUser = {};

  pageTitle!: string;
  activeAgentLimits: boolean = false;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.pageTitle = data['title'];
        this.activeAgentLimits = (!!data['role'] && data['role'] === "agent");
        this.searchConditions['role'] = data['role'];
        this.getUsers(this.searchConditions);
      }
    });
  }
//TODO wrong response type
  getUsers(searchConditions: SearchUser){
    this.adminService.showUsers(searchConditions).subscribe({
      next: (response: Users) => this.users = response.data,
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
    this.router.navigate(['user-edit', id]);
  }

  goToAddAgentLimits(id: string){
    this.router.navigate(['admin/add-agent-limit', {agentID: id}]);
  }
}
