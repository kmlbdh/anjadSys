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
    path: '',
    component: AgentComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => UserModule,
        data: {breadcrumb: 'المستخدمين'}
      },
      {
        path: 'service',
        loadChildren: () => ServiceModule,
        data: {breadcrumb: 'الخدمات'}
      },
      {
        path: 'account',
        loadChildren: () => AccountModule,
        data: {breadcrumb: 'المالية'}
      },
      {
        path: 'car',
        loadChildren: () => CarModule,
        data: {breadcrumb: 'السيارات'}
      },
      {
        path: 'accident',
        loadChildren: () => AccidentModule,
        data: {breadcrumb: 'الحوادث'}
      },
      {
        path: 'insurance-policy',
        loadChildren: () => InsurancePolicyModule,
        data: {breadcrumb: 'بوالص التأمين'}
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
