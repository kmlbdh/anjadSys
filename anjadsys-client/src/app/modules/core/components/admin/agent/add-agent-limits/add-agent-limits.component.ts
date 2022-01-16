import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, first } from 'rxjs';
import { AdminService } from '../../admin.service';
import { UserAPI } from '../../../../model/user';

@Component({
  selector: 'app-add-agent-limits',
  templateUrl: './add-agent-limits.component.html',
  styleUrls: ['./add-agent-limits.component.scss']
})
export class AddAgentLimitsComponent implements OnInit {
  errorMsg: string | undefined;
  successMsg: string | undefined;
  paramAgentId: string | undefined;
  private searchAgentText$ = new Subject<string>();
  agents: any[] = [];
  selectedAgent: UserAPI | undefined;
  fullname: string | undefined;
  addAgentLimitsForm = this.fb.group({
    limitAmount: ['', Validators.required],
    agentID: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(first())
    .subscribe({
      next: params => {
        this.paramAgentId = params.get('id')!;
        this.fullname = params.get('fullname')!;
        this.agentId?.setValue(this.paramAgentId);
      }
    });
    this.searchAPI();
  }

  addAgentLimit(){
    this.adminService.addAgentLimits(this.addAgentLimitsForm.value).subscribe({
      next: response => {
        if(response.data)
          this.successMsg = response.message;
        console.log(response);
      },
      error: err => {
        this.errorMsg = err.error.message;
        console.log(err);
      }
    })
  }

  searchAgent(event: Event){
    console.log(event);
    if(!(event instanceof KeyboardEvent)){
      event.preventDefault();
      event.stopPropagation();
      this.selectedAgent = this.agents.filter(agent =>
        agent._id === this.agentId?.value)[0];
        this.fullname = `${this.selectedAgent?.username} | ${this.selectedAgent?.nickname}`;
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
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => this.adminService.listAgents({username: text, nickname: text}))
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
}
