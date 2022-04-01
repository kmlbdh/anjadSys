import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarModelAPI, CarModelArrayAPI, SearchCarModel } from 'src/app/modules/core/model/car';
import { AgentService } from '../../../agent.service';

@Component({
  selector: 'app-show-car-models',
  templateUrl: './show-car-models.component.html',
  styleUrls: ['./show-car-models.component.scss']
})
export class ShowCarModelsComponent implements OnInit, OnDestroy {
  carModels: CarModelAPI[] = [];

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
    private AgentService: AgentService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCarModels(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCarModels(searchConditions: SearchCarModel){
    this.AgentService.listCarModels(searchConditions)
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

  trackById(index: number, el: any){
    return el.id;
  }

  getPage(pageNumber: number){
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchCarModel;
    this.p = pageNumber;
    this.getCarModels(this.searchConditions);
    console.log(pageNumber);
  }
}
