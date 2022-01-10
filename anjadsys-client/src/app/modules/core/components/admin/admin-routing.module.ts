import { AddSupplierPartsComponent } from './add-supplier-parts/add-supplier-parts.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from './show-users/show-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MainComponent } from './main/main.component';
import { AddAgentLimitsComponent } from './add-agent-limits/add-agent-limits.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'show-users',
        component: ShowUsersComponent,
        data: {title: 'اظهار كافة مستخدمي النظام'}
      },
      {
        path: 'add-user',
        component: AddUserComponent
      },
      {
        path: 'show-agents',
        component: ShowUsersComponent,
        data: {role: 'agent', title: 'اظهار جميع وكلاء الشركة'}
      },
      {
        path: 'show-supplier',
        component: ShowUsersComponent,
        data: {role: 'supplier', title: 'اظهار جميع الموردين للشركة'}
      },
      {
        path: 'add-supplier-parts',
        component: AddSupplierPartsComponent
      },
      {
        path: 'add-agent-limit',
        component: AddAgentLimitsComponent
      },
      {
        path: '',
        component: MainComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
