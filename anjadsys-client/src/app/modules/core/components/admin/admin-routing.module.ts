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
import { AccountModule } from './account/account.module';
import { OtherServicesModule } from './other-services/other-services.module';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => UserModule,
        data: {breadcrumb: 'المستخدمين'}
      },
      {
        path: 'supplier',
        loadChildren: () => SupplierModule,
        data: {breadcrumb: 'الموردين'}
      },
      {
        path: 'agent',
        loadChildren: () => AgentModule,
        data: {breadcrumb: 'الوكلاء'}
      },
      {
        path: 'service',
        loadChildren: () => ServiceModule,
        data: {breadcrumb: 'الخدمات'}
      },
      {
        path: 'otherservices',
        loadChildren: () => OtherServicesModule,
        data: {breadcrumb: 'خدمات أخرى'}
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
        path: 'account',
        loadChildren: () => AccountModule,
        data: {breadcrumb: 'المالية'}
      },
      {
        path: '',
        component: MainComponent,
        // data: {breadcrumb: 'الرئيسة'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
