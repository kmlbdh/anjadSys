import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarModelAPI, CarModelArrayAPI, SearchCarModel } from 'src/app/modules/core/model/car';
import { AgentService } from '../../../agent.service';
import { CarTypeAPI, SearchCarType, CarTypeArrayAPI } from '../../../../../model/car';

@Component({
  selector: 'app-show-car-models',
  templateUrl: './show-car-models.component.html',
  styleUrls: ['./show-car-models.component.scss']
})
export class ShowCarModelsComponent implements OnInit, OnDestroy {
  carModels: CarModelAPI[] = [];
  carTypes: CarTypeAPI[] = [];

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchCarModel = {};

  constructor(
    private agentService: AgentService,
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
    this.agentService.CarModelsAPIs.list(searchConditions)
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

  getCarTypes(searchConditions: SearchCarType){
    this.agentService.CarTypesAPIs.list(searchConditions)
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
