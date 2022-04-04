import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { CarModelAPI, CarModelArrayAPI, SearchCarModel } from 'src/app/modules/core/model/car';
import { AdminService } from '../../../admin.service';
import { SearchCarType, CarTypeArrayAPI, CarTypeAPI } from '../../../../../model/car';

@Component({
  selector: 'app-show-car-models',
  templateUrl: './show-car-models.component.html',
  styleUrls: ['./show-car-models.component.scss']
})
export class ShowCarModelsComponent implements OnInit, OnDestroy {
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  carModels: CarModelAPI[] = [];
  carTypes: CarTypeAPI[] = [];

  p: number = 1;
  private unsubscribe$ = new Subject<void>();
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCarModel = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCarTypes({limit: 999999999999999})
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  searchCarModel(event: Event){
    console.log(event);
    // if(event == null || event.target?.value == null) return;
    let carTypeId = Number(((event.target) as HTMLInputElement).value);
    // let formObj = this.searchCarModelForm.value;
    this.searchConditions = {carTypeId};

    this.getCarModels(this.searchConditions);
  }

  getCarModels(searchConditions: SearchCarModel){
    this.adminService.listCarModels(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarModelArrayAPI) =>{
        if(response.data){
          this.carModels = response.data;
          this.pagination.total = response.total;
        }
      },
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

  getCarTypes(searchConditions: SearchCarType){
    this.adminService.listCarTypes(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: CarTypeArrayAPI) => {
        if(response.data){
          this.carTypes = response.data;
        }
      },
      error: (error) => console.log(error)
    })
  }

  goToCarModelEdit(id: number){
    this.router.navigate(['admin/car/car-model/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchCarModel;
    this.p = pageNumber;
    this.getCarModels(this.searchConditions);
    // console.log(pageNumber);
  }
}
