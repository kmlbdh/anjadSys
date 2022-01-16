import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from './user/show-users/show-users.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { MainComponent } from './main/main.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ServiceModule } from './service/service.module';
import { AgentModule } from './agent/agent.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => UserModule
      },
      {
        path: 'supplier',
        loadChildren: () => SupplierModule
      },
      {
        path: 'agent',
        loadChildren: () => AgentModule
      },
      {
        path: 'service',
        loadChildren: () => ServiceModule
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
