import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServiceAPI } from 'src/app/modules/core/model/service';
import { AgentService } from '../../agent.service';
import { SearchService } from '@models/service';

@Component({
  selector: 'app-show-services',
  templateUrl: './show-services.component.html',
  styleUrls: ['./show-services.component.scss']
})
export class ShowServicesComponent implements OnInit, OnDestroy {

  services: ServiceAPI[] = [];
  private unsubscribe$ = new Subject<void>();

  selectedAgentName: string | undefined;
  currency: string = 'شيكل';
  day: string = 'يوم';

  searchConditions : SearchService = {} as SearchService;

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  errorMsg: string | undefined;
  successMsg: string | undefined;

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.loadServices(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadServices(searchConditions : SearchService): void {
    this.agentService.ServicesAPIs.list(searchConditions)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.services = response.data;
            this.pagination.total = response.total;
          }
          console.log(response.data);
        },
        error: err => console.log(err)
      });
  }

  trackById(index: number, el: any): string {
    return el._id;
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { skip: skip } as SearchService;
    this.p = pageNumber;
    this.loadServices(this.searchConditions);
    console.log(pageNumber);
  }

}
