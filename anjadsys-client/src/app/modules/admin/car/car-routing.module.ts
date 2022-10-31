import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'car-customer',
    // loadChildren: () => CarCustomerModule
    loadChildren: () => import('./car-customer/car-customer.module')
      .then(m => m.CarCustomerModule),
  },
  {
    path: 'car-type',
    // loadChildren: () => CarTypeModule
    loadChildren: () => import('./car-type/car-type.module')
      .then(m => m.CarTypeModule),
  },
  {
    path: 'car-model',
    // loadChildren: () => CarModelModule
    loadChildren: () => import('./car-model/car-model.module')
      .then(m => m.CarModelModule),
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
