import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show-users/show-users.component';
import { AddAgentLimitsComponent } from './add-agent-limits/add-agent-limits.component';
import { ShowAgentCustomersComponent } from './show-agent-customers/show-agent-customers.component';
import { ShowAgentLimitsComponent } from './show-agent-limits/show-agent-limits.component';

const routes: Routes = [
  {
    path: 'show-agent-limits/:id',
    component: ShowAgentLimitsComponent,
    // data: {role: 'supplier', title: 'اظهار جميع الموردين للشركة'}
  },
  {
    path: 'show-agent-customers/:id',
    component: ShowAgentCustomersComponent,
  },
  {
    path: 'add-agent-limit',
    component: AddAgentLimitsComponent
  },
  {
    path: 'show-agents',
    component: ShowUsersComponent,
    data: {role: 'agent', title: 'اظهار جميع وكلاء الشركة'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
