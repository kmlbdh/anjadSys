import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SearchUser, UserAPI, UsersAPI } from 'src/app/modules/core/model/user';
import { AgentService } from '../../agent.service';

@Component({
  selector: 'app-show-suppliers',
  templateUrl: './show-suppliers.component.html',
  styleUrls: ['./show-suppliers.component.scss']
})
export class ShowSuppliersComponent implements OnInit, OnDestroy {
  users: UserAPI[] = [];

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

  constructor(
    private agentService: AgentService) { }

  ngOnInit(): void {
    this.listSuppliers(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

//TODO wrong response type
  listSuppliers(searchConditions: SearchUser){
    this.agentService.listSuppliers(searchConditions)
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

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { skip: skip } as SearchUser;
    this.p = pageNumber;
    this.listSuppliers(this.searchConditions);
    console.log(pageNumber);
  }
}
