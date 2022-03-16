import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccidentModule } from './accident/accident.module';
import { AgentComponent } from './agent.component';
import { CarModule } from './car/car.module';
import { InsurancePolicyModule } from './insurance-policy/insurance-policy.module';
import { MainComponent } from './main/main.component';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';

const routes: Routes = [
  {
    path: 'agent',
    component: AgentComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => UserModule
      },
      {
        path: 'service',
        loadChildren: () => ServiceModule
      },
      {
        path: 'account',
        loadChildren: () => AccountModule
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
export class AgentRoutingModule { }
