import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarCustomerModule } from './car-customer/car-customer.module';
import { CarModelModule } from './car-model/car-model.module';
import { CarTypeModule } from './car-type/car-type.module';


const routes: Routes = [
  {
    path: 'car-customer',
    loadChildren: () => CarCustomerModule
  },
  {
    path: 'car-type',
    loadChildren: () => CarTypeModule
  },
  {
    path: 'car-model',
    loadChildren: () => CarModelModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
