import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarCustomerComponent } from './add/add-car-customer.component';
import { ShowCarCustomerComponent } from './show/show-car-customer.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarCustomerComponent,
    data: {breadcrumb: 'اظهار جميع سيارات الزبائن'}
  },
  {
    path: 'add',
    component: AddCarCustomerComponent,
    data: {breadcrumb: 'اضافة سيارة جديد'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCustomerRoutingModule { }
