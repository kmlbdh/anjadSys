import { Component, OnInit, OnDestroy } from '@angular/core';
import { faCarCrash, faFileContract, faTruckMoving, faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { takeUntil, Subject } from 'rxjs';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  customers!: number;
  suppliers!: number;
  agents!: number;
  insurancePolicies!: number;
  accidents!: number;

  customersIcon = faUsers;
  agentsIcon = faUserTie;
  suppliersIcon = faTruckMoving;
  accidentIcon = faCarCrash;
  insurancePoliciesIcon = faFileContract;

  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getStatistics = () => {
    this.adminService.GeneralAPIs.statistics()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.customers = response.data.customers;
          this.suppliers = response.data.suppliers;
          this.agents = response.data.agents;
          this.insurancePolicies = response.data.insurancePolicies;
          this.accidents = response.data.accidents;
        }
      },
      error: (err) => console.log(err)
    })
  }

}
