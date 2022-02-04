import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AccidentAPI, SearchAccident, AccidentsAPI } from '../../../../model/accident';

@Component({
  selector: 'app-show-accident',
  templateUrl: './show-accident.component.html',
  styleUrls: ['./show-accident.component.scss']
})
export class ShowAccidentComponent implements OnInit, OnDestroy {
  accidents: AccidentAPI[] = [];
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  private unsubscribe$ = new Subject<void>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchAccident = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getAccidents(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAccidents(searchConditions: SearchAccident){
    this.adminService.listAccidents(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: AccidentsAPI) => this.accidents = response.data,
      error: (error: any) => console.log(error)
    });
  }

  deleteAccident(accident: AccidentAPI){
    if(!accident) return;

    const yes = confirm(`هل تريد حذف بلاغ حادث رقم ${accident.id} للزبون ${accident.Customer.username}`);
    if(!yes) return;

    this.adminService.deleteAccident(accident.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getAccidents(this.searchConditions);
        console.log(response);
      },
      error: (err: any) => console.log(err)
    })
  }

  goToAccidentEdit(id: number){
    this.router.navigate(['admin/accident/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }
}
