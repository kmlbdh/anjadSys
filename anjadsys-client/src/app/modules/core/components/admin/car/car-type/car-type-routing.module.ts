import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCarTypeComponent } from './edit/edit-car-type.component';
import { ShowCarTypesComponent } from './show/show-car-types.component';
import { AddCarTypeComponent } from './add/add-car-type.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditCarTypeComponent,
    data: {breadcrumb: 'تعديل بيانات نوع السيارة'}
  },
  {
    path: 'show',
    component: ShowCarTypesComponent,
    data: {breadcrumb: 'اظهار جميع انواع السيارات'}
  },
  {
    path: 'add',
    component: AddCarTypeComponent,
    data: {breadcrumb: 'اضافة نوع سيارة جديد'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarTypeRoutingModule { }
