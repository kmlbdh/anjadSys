import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { ServiceAPI } from '../../../../model/service';

@Component({
  selector: 'app-show-services',
  templateUrl: './show-services.component.html',
  styleUrls: ['./show-services.component.scss']
})
export class ShowServicesComponent implements OnInit {
  services: ServiceAPI[] = [];
  private unsubscribe$ = new Subject<void>();

  trashIcon = faTrashAlt;
  editServiceIcon = faEdit;
  selectedAgentName: string | undefined;
  currency: string = "شيكل";

  errorMsg: string | undefined;
  successMsg: string | undefined;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadServices(): void{
    this.adminService.listServices()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.services = response.data;
        }
        console.log(response.data);
      },
      error: err => console.log(err)
    })
  }

  deleteService(service: ServiceAPI): void{
    const yes = confirm(`هل تريد حذف الخدمة "${service.name}"؟`);
    if(!yes) return;

    this.adminService.deleteService(service._id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.loadServices();
        }
        console.log(response.data);
      },
      error: err => console.log(err)
    })
  }

  trackById(index: number, el: any): string{
    return el._id;
  }

  goToEditService(service: ServiceAPI){
    this.router.navigate([`/admin/edit-service/${service._id}`]);
  }
}
