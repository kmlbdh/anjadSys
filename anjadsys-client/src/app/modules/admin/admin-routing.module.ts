import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('./user/user.module')
          .then(m => m.UserModule),
        data: { breadcrumb: 'المستخدمين' }
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module')
          .then(m => m.SupplierModule),
        data: { breadcrumb: 'الموردين' }
      },
      {
        path: 'agent',
        loadChildren: () => import('./agent/agent.module')
          .then(m => m.AgentModule),
        data: { breadcrumb: 'الوكلاء' }
      },
      {
        path: 'service',
        loadChildren: () => import('./service/service.module')
          .then(m => m.ServiceModule),
        data: { breadcrumb: 'الخدمات' }
      },
      {
        path: 'otherservices',
        loadChildren: () => import('./other-services/other-services.module')
          .then(m => m.OtherServicesModule),
        data: { breadcrumb: 'خدمات أخرى' }
      },
      {
        path: 'car',
        loadChildren: () => import('./car/car.module')
          .then(m => m.CarModule),
        data: { breadcrumb: 'السيارات' }
      },
      {
        path: 'accident',
        loadChildren: () => import('./accident/accident.module')
          .then(m => m.AccidentModule),
        data: { breadcrumb: 'الحوادث' }
      },
      {
        path: 'insurance-policy',
        loadChildren: () => import('./insurance-policy/insurance-policy.module')
          .then(m => m.InsurancePolicyModule),
        data: { breadcrumb: 'بوالص التأمين' }
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module')
          .then(m => m.AccountModule),
        data: { breadcrumb: 'المالية' }
      },
      {
        path: 'endorsement',
        loadChildren: () => import('./endorsement/endorsement.module')
          .then(m => m.EndorsementModule),
        data: { breadcrumb: 'الملحقات' }
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
export class AdminRoutingModule { }
