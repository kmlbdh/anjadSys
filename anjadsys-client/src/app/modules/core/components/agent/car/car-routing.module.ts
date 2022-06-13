import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarCustomerModule } from './car-customer/car-customer.module';
import { CarModelModule } from './car-model/car-model.module';
import { CarTypeModule } from './car-type/car-type.module';


const routes: Routes = [
  {
    path: 'car-customer',
    loadChildren: () => CarCustomerModule,
    // data: {breadcrumb: 'سيارات الزبائن'}
  },
  {
    path: 'car-type',
    loadChildren: () => CarTypeModule,
    // data: {breadcrumb: 'انواع السيارات'}
  },
  {
    path: 'car-model',
    loadChildren: () => CarModelModule,
    // data: {breadcrumb: 'موديلات السيارات'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
