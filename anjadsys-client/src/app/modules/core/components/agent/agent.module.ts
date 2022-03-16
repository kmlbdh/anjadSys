import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { AgentComponent } from './agent.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentService } from './agent.service';
import { SharedModule } from '../../../shared/shared.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    AgentComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    AgentRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [AgentService]
})
export class AgentModule { }
