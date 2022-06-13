import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOtherservicesComponent } from './add/add-otherservices.component';
import { ShowOtherservicesComponent } from './show/show-otherservices.component';
import { EditOtherservicesComponent } from './edit/edit-otherservices.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditOtherservicesComponent,
    data: {breadcrumb: 'تعديل بيانات الخدمة'}
  },
  {
    path: 'show',
    component: ShowOtherservicesComponent,
    data: {breadcrumb: 'اظهار جميع الخدمات'}
  },
  {
    path: 'add',
    component: AddOtherservicesComponent,
    data: {breadcrumb: 'اضافة خدمة اخرى جديدة'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherServicesRoutingModule { }
