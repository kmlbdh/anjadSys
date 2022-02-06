import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ServiceModule } from './service/service.module';
import { AgentModule } from './agent/agent.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { AccidentModule } from './accident/accident.module';
import { InsurancePolicyModule } from './insurance-policy/insurance-policy.module';

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
        path: 'car',
        loadChildren: () => CarModule
      },
      {
        path: 'accident',
        loadChildren: () => AccidentModule
      },
      {
        path: 'insurance-policy',
        loadChildren: () => InsurancePolicyModule
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
