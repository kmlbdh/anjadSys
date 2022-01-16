import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { first, Subject, takeUntil } from 'rxjs';
import { partAPI } from '../../../../model/supplierparts';

@Component({
  selector: 'app-list-supplier-parts',
  templateUrl: './list-supplier-parts.component.html',
  styleUrls: ['./list-supplier-parts.component.scss']
})
export class ListSupplierPartsComponent implements OnInit {
  parts: partAPI[] = [];

  private unsubscribe$ = new Subject<void>();
  trashIcon = faTrashAlt;
  selectedSupplier: string | undefined;
  currency: string = "شيكل";
  errorMsg: string | undefined;
  successMsg: string | undefined;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadSupplierPartsById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadSupplierPartsById(): void{
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        const supplierId = params.get('id');

       this.selectedSupplier = params.get('fullname') || undefined;
        console.log(this.selectedSupplier);
        if(!supplierId || !this.selectedSupplier) this.router.navigate(['admin/show-supplier']);

        this.adminService.listSupplierParts({supplierID: supplierId?.toUpperCase()!})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: response => {
            if(response.data)
              this.parts = response.data;
            console.log(response.data);
          },
          error: err => console.log(err)
        })
      }
    });
  }

  deletePart(part: partAPI): void{
    const yes = confirm(`هل تريد حذف القطعة "${part.partNo || ''} | ${part.partName}"  للمورد؟`);
    if(!yes) return;

    this.adminService.deleteSupplierPart(part._id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.loadSupplierPartsById();
        }
        console.log(response.data);
      },
      error: err => console.log(err)
    })
  }

  trackById(index: number, el: any): string{
    return el._id;
  }
}
