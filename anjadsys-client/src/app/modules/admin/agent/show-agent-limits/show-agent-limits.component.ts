import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { AgentLimitsAPI, SearchAgentLimits } from '@models/agentlimits';

@Component({
  selector: 'app-show-agent-limits',
  templateUrl: './show-agent-limits.component.html',
  styleUrls: ['./show-agent-limits.component.scss']
})
export class ShowAgentLimitsComponent implements OnInit, OnDestroy {

  agentLimits: AgentLimitsAPI[] = [];
  private unsubscribe$ = new Subject<void>();

  selectedAgentName: string | undefined;
  currency: string = 'شيكل';

  p: number = 1;
  pagination = {
    total: 0,
    itemsPerPage: 10,
  };

  errorMsg: string | undefined;
  successMsg: string | undefined;
  searchConditions: SearchAgentLimits = {} as SearchAgentLimits;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAgentLimitsById(this.searchConditions);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadAgentLimitsById(searchAgentLimits: SearchAgentLimits): void {
    this.route.paramMap
      .pipe(first())
      .subscribe({
        next: params => {
          const agentId = params.get('id');

          this.selectedAgentName = params.get('fullname') || undefined;
          console.log(this.selectedAgentName);
          if (!agentId || !this.selectedAgentName) { this.router.navigate(['admin/show-agents']); }
          searchAgentLimits = { ...searchAgentLimits, agentID: agentId?.toUpperCase()!, main: false };
          this.adminService.AgentLimitsAPIs.listLimits(searchAgentLimits)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: response => {
                if (response.data) {
                  this.agentLimits = response.data;
                  this.pagination.total = response.total;
                }
                console.log(response.data);
              },
              error: err => console.log(err)
            });
        }
      });
  }

  deleteAgentLimits(agentLimits: AgentLimitsAPI): void {
    const yes = confirm(`هل تريد حذف السقف المالي "${ agentLimits.debit }" للوكيل؟`);
    if (!yes) { return; }

    this.adminService.AgentLimitsAPIs.delete(agentLimits.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          if (response.data) {
            this.loadAgentLimitsById(this.searchConditions);
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
    this.searchConditions = { ...this.searchConditions, skip: skip } as SearchAgentLimits;
    this.p = pageNumber;
    this.loadAgentLimitsById(this.searchConditions);
    console.log(pageNumber);
  }

}
