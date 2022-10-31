import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentLimitsAPI } from '../../../core/model/agentlimits';

@Component({
  selector: 'app-agent-limits-modal',
  templateUrl: './agent-limits-modal.component.html',
  styleUrls: ['./agent-limits-modal.component.scss']
})
export class AgentLimitsModalComponent {

  modalAgentLimits: AgentLimitsAPI = {} as AgentLimitsAPI;

  constructor(public activeModal: NgbActiveModal) { }

  printPage(): void {
    window.print();
  }

}
