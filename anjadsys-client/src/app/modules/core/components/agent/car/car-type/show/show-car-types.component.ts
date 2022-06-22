import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarTypeAPI, CarTypeArrayAPI, SearchCarType } from 'src/app/modules/core/model/car';
import { AgentService } from '../../../agent.service';

@Component({
  selector: 'app-show-car-types',
  templateUrl: './show-car-types.component.html',
  styleUrls: ['./show-car-types.component.scss']
})
export class ShowCarTypesComponent implements OnInit, OnDestroy {

  carTypes: CarTypeAPI[] = [];

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
    private agentService: AgentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCarTypes(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCarTypes(searchConditions: SearchCarType) {
    this.agentService.CarTypesAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: CarTypeArrayAPI) => {
          if (response.data) {
            this.carTypes = response.data;
            this.pagination.total = response.total;
          }
        },
        error: error => console.log(error)
      });
  }

  trackById(index: number, el: any) {
    return el.id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchCarType;
    this.p = pageNumber;
    this.getCarTypes(this.searchConditions);
    console.log(pageNumber);
  }

}
