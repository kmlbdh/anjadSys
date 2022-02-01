import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AgentLimitsAPI } from '../../../../model/agentlimits';

@Component({
  selector: 'app-show-agent-limits',
  templateUrl: './show-agent-limits.component.html',
  styleUrls: ['./show-agent-limits.component.scss']
})
export class ShowAgentLimitsComponent implements OnInit, OnDestroy {
  agentLimits: AgentLimitsAPI[] = [];
  private unsubscribe$ = new Subject<void>();
  trashIcon = faTrashAlt;
  selectedAgentName: string | undefined;
  currency: string = "شيكل";

  // userEditIcon = faUserEdit;
  // addAgentLimitIcon = faFileInvoiceDollar;
  // agentLimitsListIcon = faCopy;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  // searchConditions: SearchUser = {};

  // pageTitle!: string;
  // activeAgentLimits: boolean = false;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadAgentLimitsById();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadAgentLimitsById(): void{
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        const agentId = params.get('id');

       this.selectedAgentName = params.get('fullname') || undefined;
        console.log(this.selectedAgentName);
        if(!agentId || !this.selectedAgentName) this.router.navigate(['admin/show-agents']);

        this.adminService.listAgentLimits({agentID: agentId?.toUpperCase()!, main: false})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: response => {
            if(response.data){
              this.agentLimits = response.data;
            }
            console.log(response.data);
          },
          error: err => console.log(err)
        })
      }
    });
  }

  deleteAgentLimits(agentLimits: AgentLimitsAPI): void{
    const yes = confirm(`هل تريد حذف السقف المالي "${agentLimits.debit}" للوكيل؟`);
    if(!yes) return;

    this.adminService.deleteAgentLimits(agentLimits.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data){
          this.loadAgentLimitsById();
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
