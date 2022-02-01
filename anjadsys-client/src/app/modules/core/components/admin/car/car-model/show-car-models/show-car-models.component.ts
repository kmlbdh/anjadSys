import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { CarModelAPI, CarModelArrayAPI, SearchCarModel } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-show-car-models',
  templateUrl: './show-car-models.component.html',
  styleUrls: ['./show-car-models.component.scss']
})
export class ShowCarModelsComponent implements OnInit, OnDestroy {
  carModels: CarModelAPI[] = [];
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  private unsubscribe$ = new Subject<void>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCarModel = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCarModels(this.searchConditions);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCarModels(searchConditions: SearchCarModel){
    this.adminService.listCarModels(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarModelArrayAPI) => this.carModels = response.data,
      error: (error) => console.log(error)
    })
  }

  deleteCarModel(carModel: any){
    if(!carModel) return;

    const yes = confirm(`هل تريد حذف موديل السيارة رقم ${carModel.id} واسم ${carModel.name}`);
    if(!yes) return;

    this.adminService.deleteCarModel(carModel.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getCarModels(this.searchConditions);
        console.log(response);
      },
      error: err => console.log(err)
    })
  }

  goToCarModelEdit(id: number){
    this.router.navigate(['admin/car/car-model/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }
}
