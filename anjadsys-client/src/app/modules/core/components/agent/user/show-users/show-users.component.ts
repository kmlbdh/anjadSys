import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { SearchUser, UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AgentService } from '../../agent.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.scss']
})
export class ShowUsersComponent implements OnInit, OnDestroy {
  users: UserAPI[] = [];
  trashIcon = faTrashAlt;
  userEditIcon = faEdit;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchUser = {};

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  rolesLang:{
    [index: string]: string;
  } = {
    'supplier':  'مورد',
    'customer': 'زبون'
  };

  constructor( private agentService: AgentService ) { }

  ngOnInit(): void {
    this.getUsers(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

//TODO wrong response type
  getUsers(searchConditions: SearchUser){
    this.agentService.showUsers(searchConditions)
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

  // deleteUser(user: any){
  //   if(!user) return;

  //   const yes = confirm(`هل تريد حذف المستخدم ${user.username} ورقم حسابه ${user.id}`);
  //   if(!yes) return;

  //   this.agentService.deleteUser(user.id)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe({
  //     next: response => {
  //       if(response.data)
  //         this.successMsg = response.message;

  //       this.getUsers(this.searchConditions);
  //       console.log(response);
  //     },
  //     error: err => console.log(err)
  //   });
  // }

  trackById(index: number, el: any){
    return el.id;
  }

  // goToUserEdit(id: string){
  //   this.router.navigate(['agent/user/edit', id]);
  // }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { skip: skip } as SearchUser;
    this.p = pageNumber;
    this.getUsers(this.searchConditions);
    console.log(pageNumber);
  }

}
