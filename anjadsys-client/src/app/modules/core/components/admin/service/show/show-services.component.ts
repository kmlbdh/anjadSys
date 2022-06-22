import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { ServiceAPI, SearchService } from '../../../../model/service';

@Component({
  selector: 'app-show-services',
  templateUrl: './show-services.component.html',
  styleUrls: ['./show-services.component.scss']
})
export class ShowServicesComponent implements OnInit, OnDestroy {

  services: ServiceAPI[] = [];

  packageTypeArray = [ 'الضفة الغربية', 'القدس', 'القدس والضفة الغربية' ];

  private unsubscribe$ = new Subject<void>();

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  trashIcon = faTrashAlt;
  editServiceIcon = faEdit;

  searchConditions: SearchService = {} as SearchService;

  selectedAgentName: string | undefined;
  currency: string = 'شيكل';
  day: string = 'يوم';

  errorMsg: string | undefined;
  successMsg: string | undefined;

  constructor(
    private adminService: AdminService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadServices(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadServices(searchCondition: SearchService): void {
    this.adminService.ServicesAPIs.list(searchCondition)
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

  deleteService(service: ServiceAPI): void {
    const yes = confirm(`هل تريد حذف الخدمة "${ service.name }"؟`);
    if (!yes) { return; }

    this.adminService.ServicesAPIs.delete(service.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.loadServices(this.searchConditions);
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

  goToEditService(service: ServiceAPI) {
    this.router.navigate([`/admin/service/edit/${ service.id }`]);
  }

  getPage(pageNumber: number) {
    let skip = (pageNumber - 1 ) * this.pagination.itemsPerPage;
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchService;
    this.p = pageNumber;
    this.loadServices(this.searchConditions);
    console.log(pageNumber);
  }

}
