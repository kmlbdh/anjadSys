import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { ShowAgentLimitsComponent } from './show-agent-limits/show-agent-limits.component';
import { ShowAgentCustomersComponent } from './show-agent-customers/show-agent-customers.component';
import { AddAgentLimitsComponent } from './add-agent-limits/add-agent-limits.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ShowAgentLimitsComponent,
    ShowAgentCustomersComponent,
    AddAgentLimitsComponent
  ],
  imports: [
    CommonModule,
    AgentRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class AgentModule { }
