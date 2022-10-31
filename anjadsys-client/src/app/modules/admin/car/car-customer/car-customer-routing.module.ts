import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCarCustomerComponent } from './add/add-car-customer.component';
import { ShowCarCustomerComponent } from './show/show-car-customer.component';
import { EditCarCustomerComponent } from './edit/edit-car-customer.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditCarCustomerComponent,
    data: { breadcrumb: 'تعديل بيانات السيارة' }
  },
  {
    path: 'show',
    component: ShowCarCustomerComponent,
    data: { breadcrumb: 'اظهار جميع سيارات الزبائن' }
  },
  {
    path: 'add',
    component: AddCarCustomerComponent,
    data: { breadcrumb: 'اضافة سيارة جديد' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarCustomerRoutingModule { }
