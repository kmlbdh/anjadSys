import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarCustomerComponent } from './add-car-customer/add-car-customer.component';
import { ShowCarCustomerComponent } from './show-car-customer/show-car-customer.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarCustomerComponent,
  },
  {
    path: 'add',
    component: AddCarCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCustomerRoutingModule { }
