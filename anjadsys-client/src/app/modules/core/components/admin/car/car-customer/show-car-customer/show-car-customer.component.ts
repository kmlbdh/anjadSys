import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CarAPI, CarsAPI, SearchCar } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-show-car-customer',
  templateUrl: './show-car-customer.component.html',
  styleUrls: ['./show-car-customer.component.scss']
})
export class ShowCarCustomerComponent implements OnInit, OnDestroy {
  cars: CarAPI[] = [];
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  private unsubscribe$ = new Subject<void>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCar = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCars(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCars(searchConditions: SearchCar){
    this.adminService.showCars(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarsAPI) => this.cars = response.data,
      error: (error: any) => console.log(error)
    });
  }

  deleteCar(car: any){
    if(!car) return;

    const yes = confirm(`هل تريد حذف السيارة رقم ${car.carNumber} للزبون ${car.User.username}`);
    if(!yes) return;

    this.adminService.deleteCar(car.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getCars(this.searchConditions);
        console.log(response);
      },
      error: err => console.log(err)
    })
  }

  goToCarEdit(id: number){
    this.router.navigate(['admin/car/car-customer/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }
}
