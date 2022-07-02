import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show/show-users.component';
import { AddAgentLimitsComponent } from './add-agent-limits/add-agent-limits.component';
import { ShowAgentCustomersComponent } from './show-agent-customers/show-agent-customers.component';
import { ShowAgentLimitsComponent } from './show-agent-limits/show-agent-limits.component';

const routes: Routes = [
  {
    path: 'show-agent-limits/:id',
    component: ShowAgentLimitsComponent,
    data: { breadcrumb: 'اظهار جميع الاسقف المالية للوكيل' }
  },
  {
    path: 'show-agent-customers/:id',
    component: ShowAgentCustomersComponent,
    data: { breadcrumb: 'اظهار جميع زبائن الوكيل' }
  },
  {
    path: 'add-agent-limit',
    component: AddAgentLimitsComponent,
    data: { breadcrumb: 'اضافة سقف مالي جديد' }
  },
  {
    path: 'show',
    component: ShowUsersComponent,
    data: { role: 'agent', breadcrumb: 'اظهار جميع الوكلاء' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
