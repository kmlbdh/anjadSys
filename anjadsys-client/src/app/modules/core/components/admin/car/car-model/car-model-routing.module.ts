import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCarModelComponent } from './edit/edit-car-model.component';
import { ShowCarModelsComponent } from './show/show-car-models.component';
import { AddCarModelComponent } from './add/add-car-model.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditCarModelComponent,
    data: {breadcrumb: 'تعديل بيانات موديل السيارة'}
  },
  {
    path: 'show',
    component: ShowCarModelsComponent,
    data: {breadcrumb: 'اظهار جميع موديلات السيارات'}
  },
  {
    path: 'add',
    component: AddCarModelComponent,
    data: {breadcrumb: 'اضافة موديل سيارة جديد'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
