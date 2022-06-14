import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentComponent } from './agent.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
    children: [
      {
        path: 'user',
        // loadChildren: () => UserModule
        loadChildren: () => import('./user/user.module')
        .then(m => m.UserModule),
        data: {breadcrumb: 'المستخدمين'}
      },
      {
        path: 'service',
        // loadChildren: () => ServiceModule,
        loadChildren: () => import('./service/service.module')
        .then(m => m.ServiceModule),
        data: {breadcrumb: 'الخدمات'}
      },
      {
        path: 'car',
        // loadChildren: () => CarModule,
        loadChildren: () => import('./car/car.module')
        .then(m => m.CarModule),
        data: {breadcrumb: 'السيارات'}
      },
      {
        path: 'accident',
        // loadChildren: () => AccidentModule,
        loadChildren: () => import('./accident/accident.module')
        .then(m => m.AccidentModule),
        data: {breadcrumb: 'الحوادث'}
      },
      {
        path: 'insurance-policy',
        // loadChildren: () => InsurancePolicyModule,
        loadChildren: () => import('./insurance-policy/insurance-policy.module')
        .then(m => m.InsurancePolicyModule),
        data: {breadcrumb: 'بوالص التأمين'}
      },
      {
        path: 'account',
        // loadChildren: () => AccountModule,
        loadChildren: () => import('./account/account.module')
        .then(m => m.AccountModule),
        data: {breadcrumb: 'المالية'}
      },
      {
        path: '',
        component: MainComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
