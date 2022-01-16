import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { UserAPI } from 'src/app/modules/core/model/user';

@Component({
  selector: 'app-show-agent-customers',
  templateUrl: './show-agent-customers.component.html',
  styleUrls: ['./show-agent-customers.component.scss']
})
export class ShowAgentCustomersComponent implements OnInit, OnDestroy{
  selectedAgentName: string | undefined;
  unsubscribe$ = new Subject<void>();
  customers: UserAPI[] = [];
  trashIcon = faTrashAlt;
  userEditIcon = faUserEdit;
  successMsg: string | undefined;
  errorMsg: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCustomerById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  trackById(index: number, el: any){
    return el._id;
  }

  loadCustomerById(): void{
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        const agentId = params.get('id');
        if(!agentId)
          this.router.navigate(['admin/show-agents']);

       this.selectedAgentName = params.get('fullname') || undefined;

       this.adminService.showUsers({agentID: agentId!})
       .pipe(takeUntil(this.unsubscribe$))
       .subscribe({
         next: response => {
           if(response.data)
             this.customers = response.data;

           console.log(response.data);
         },
         error: err => console.log(err)
       })
      }
    });
  }

  goToUserEdit(id: string): void{
    this.router.navigate(['/admin/edit-user/', id]);
  }

  deleteUser(user: UserAPI){
    if(!user) return;

    const yes = confirm(`هل تريد حذف المستخدم ${user.username} ورقم حسابه ${user._id}`);
    if(!yes) return;

    this.adminService.deleteUser(user._id).subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.loadCustomerById();
      },
      error: err => console.log(err)
    })
  }

}
