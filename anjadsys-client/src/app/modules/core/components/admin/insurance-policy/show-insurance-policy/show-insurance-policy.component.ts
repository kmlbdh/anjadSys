import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { SearchInsurancePolicy, InsurancePolicyAPI, InsurancePolicesAPI } from '../../../../model/insurancepolicy';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-show-insurance-policy',
  templateUrl: './show-insurance-policy.component.html',
  styleUrls: ['./show-insurance-policy.component.scss']
})
export class ShowInsurancePolicyComponent implements OnInit, OnDestroy {
  insurancePolices: InsurancePolicyAPI[] = [];
  trashIcon = faTrashAlt;
  carEditIcon = faEdit;

  private unsubscribe$ = new Subject<void>();

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchInsurancePolicy = {};

  constructor(
    private adminService: AdminService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getInsurancePolices(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getInsurancePolices(searchConditions: SearchInsurancePolicy){
    this.adminService.listInsurancePolicy(searchConditions)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: InsurancePolicesAPI) => this.insurancePolices = response.data,
      error: (error: any) => console.log(error)
    });
  }

  deleteInsurancePolicy(insurancePolicy: InsurancePolicyAPI){
    if(!insurancePolicy) return;

    const yes = confirm(`هل تريد حذف بوليصة التأمين رقم ${insurancePolicy.id} للزبون ${insurancePolicy.Customer.username}`);
    if(!yes) return;

    this.adminService.deleteInsurancePolicy(insurancePolicy.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;

        this.getInsurancePolices(this.searchConditions);
        console.log(response);
      },
      error: (err: any) => console.log(err)
    })
  }

  goToInsurancePolicyEdit(id: number){
    this.router.navigate(['admin/insurance-policy/edit', id]);
  }

  trackById(index: number, el: any){
    return el.id;
  }
}
