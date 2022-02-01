import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, first, takeUntil } from 'rxjs';
import { AdminService } from '../../admin.service';
import { UserAPI } from '../../../../model/user';

@Component({
  selector: 'app-add-agent-limits',
  templateUrl: './add-agent-limits.component.html',
  styleUrls: ['./add-agent-limits.component.scss']
})
export class AddAgentLimitsComponent implements OnInit, OnDestroy {
  errorMsg: string | undefined;
  successMsg: string | undefined;
  paramAgentId: string | undefined;

  private searchAgentText$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  agents: any[] = [];
  selectedAgent: UserAPI | undefined;
  fullname: string | undefined;

  addAgentLimitsForm = this.fb.group({
    debit: ['', Validators.required],
    agentID: ['', Validators.required],
  });
  TIMEOUTMILISEC = 7000;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAgentFromRoute();
    this.searchAPI();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAgentFromRoute(){
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        this.paramAgentId = params.get('id') || undefined;
        this.fullname = params.get('fullname') || undefined;
        this.agentId?.setValue(this.paramAgentId);
      }
    });
  }

  addAgentLimit(){
    if(this.addAgentLimitsForm.invalid) return;
    this.adminService.addAgentLimits(this.addAgentLimitsForm.value)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;
          setTimeout(() => this.successMsg = undefined, this.TIMEOUTMILISEC);

        console.log(response);
      },
      error: err => {
        this.errorMsg = err.error.message;
        setTimeout(() => this.errorMsg = undefined, this.TIMEOUTMILISEC);
        console.log(err);
      }
    })
  }

  searchAgent(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      event.preventDefault();
      event.stopPropagation();
      this.selectedAgent = this.agents.filter(agent => agent.id === this.agentId?.value)[0];
      this.fullname = `${this.selectedAgent?.username} | ${this.selectedAgent?.companyName}`;
      return;
    }
    if(this.agentId?.value === '')
      this.fullname = undefined;

    let agentText = ((event.target as HTMLInputElement).value)?.trim();
    if(agentText)
      this.searchAgentText$.next(agentText)
  }

  searchAPI(){
    this.searchAgentText$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => this.adminService.listAgents({username: text, companyName: text}))
    ).subscribe({
      next: response =>{
        if(response.data)
          this.agents = response.data;
          console.log(response)
      },
      error: err => console.log(err)
    })
  }

  get agentId(){
   return this.addAgentLimitsForm?.get('agentID');
  }

  formCont(controlName: string): AbstractControl {
    return this.addAgentLimitsForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean | undefined{
    if(event instanceof KeyboardEvent){
      const code = event.key;
      if(Number.isNaN(+code))
        if(code.toLowerCase() !== 'backspace')
          return false;
    } else {
      setTimeout(() => {
        const code = this.addAgentLimitsForm.get('debit')?.value;
        console.log("code", code);
        if(Number.isNaN(+code))
          this.addAgentLimitsForm.get('debit')?.setValue('');
      }, 0)

    }
    return;
  }
}
