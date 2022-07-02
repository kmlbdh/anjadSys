import { Component, OnInit, OnDestroy } from '@angular/core';
import { faUsers, faCarCrash, faFileContract, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
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
  endorsements!: number;

  customersIcon = faUsers;
  accidentIcon = faCarCrash;
  insurancePoliciesIcon = faFileContract;
  endorsementsIcon = faFolderOpen;

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
    this.agentService.GeneralAPIs.statistics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.customers = response.data.customers;
            this.insurancePolicies = response.data.insurancePolicies;
            this.accidents = response.data.accidents;
            this.endorsements = response.data.endorsements;
          }
        },
        error: error => console.log(error)
      });
  };

}
