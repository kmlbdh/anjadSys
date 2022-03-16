import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CarTypeAPI } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';
import { SearchCarType, CarTypeArrayAPI } from '../../../../../model/car';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-car-types',
  templateUrl: './show-car-types.component.html',
  styleUrls: ['./show-car-types.component.scss']
})
export class ShowCarTypesComponent implements OnInit, OnDestroy {
  carTypes: CarTypeAPI[] = [];

  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  private unsubscribe$ = new Subject<void>();
  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };
  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCarType = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCarTypes(this.searchConditions);
  }

  ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  getCarTypes(searchConditions: SearchCarType){
    this.adminService.listCarTypes(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarTypeArrayAPI) => {
        if(response.data){
          this.carTypes = response.data;
          this.pagination.total = response.total;
        }
      },
      error: (error) => console.log(error)
    })
  }

  deleteCarType(carType: any){
    if(!carType) return;

    const yes = confirm(`هل تريد حذف السيارة رقم ${carType.id} واسم ${carType.name}`);
    if(!yes) return;

    this.adminService.deleteCarType(carType.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getCarTypes(this.searchConditions);
        console.log(response);
      },
      error: err => console.log(err)
    })
  }

  goToCarTypeEdit(id: number){
    this.router.navigate(['admin/car/car-type/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { skip: skip } as SearchCarType;
    this.p = pageNumber;
    this.getCarTypes(this.searchConditions);
    console.log(pageNumber);
  }
}
