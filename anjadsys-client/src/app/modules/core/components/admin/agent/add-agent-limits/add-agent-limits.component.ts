import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, first, takeUntil, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { UserAPI } from '../../../../model/user';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-agent-limits',
  templateUrl: './add-agent-limits.component.html',
  styleUrls: ['./add-agent-limits.component.scss']
})
export class AddAgentLimitsComponent implements OnInit, OnDestroy {
  cancelInput = faTimes;

  errorMsg: string | undefined;
  successMsg: string | undefined;
  paramAgentId: string | undefined;

  private searchAgentText$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  agents: any[] = [];
  selectedAgent: UserAPI | undefined;
  fullname: string | undefined;

  private keys = ['backspace', 'arrowleft', 'arrowright'];
  addAgentLimitsForm = this.fb.group({
    debit: ['', Validators.required],
    agentID: ['', Validators.required],
  });
  spinnerAgent: boolean = false;

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
      this.searchAgentText$.next(agentText);
  }

  searchAPI(){
    this.searchAgentText$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.spinnerAgent = true),
      switchMap(text => this.adminService.listAgents({username: text, companyName: text,  skipLoadingInterceptor: true}))
    ).subscribe({
      next: response =>{
        if(response.data)
          this.agents = response.data;

        this.spinnerAgent = false;
        console.log(response)
      },
      error: err => {
        this.spinnerAgent = false;
        console.log(err);
      }
    })
  }

  cancelAgentInput(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.selectedAgent = undefined;
    this.fullname = undefined;
    this.agentId?.setValue('');
  }

  get agentId(){
   return this.addAgentLimitsForm?.get('agentID');
  }

  formCont(controlName: string): AbstractControl {
    return this.addAgentLimitsForm.controls[controlName];
  }

  acceptNumbers(event: Event): Boolean{
    if(event instanceof KeyboardEvent){
      const code = event.key;
      console.log(code);
      if(Number.isNaN(+code))
        if(!this.keys.includes(code.toLowerCase()))
          return false;
    }
    return true;
  }
}
