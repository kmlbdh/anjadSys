import { Component, OnInit, OnDestroy } from '@angular/core';
import { faUsers, faCarCrash, faFileContract } from '@fortawesome/free-solid-svg-icons';
import { AgentService } from '../agent.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  customers!: number;
  insurancePolicies!: number;
  accidents!: number;

  customersIcon = faUsers;
  accidentIcon = faCarCrash;
  insurancePoliciesIcon = faFileContract;

  private unsubscribe$ = new Subject<void>();

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getStatistics = () => {
    this.agentService.statisticsForMainPage()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.customers = response.data.customers;
          this.insurancePolicies = response.data.insurancePolicies;
          this.accidents = response.data.accidents;
        }
      },
      error: (error) => console.log(error)
    })
  }
}
