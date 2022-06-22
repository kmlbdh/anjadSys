import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddServiceComponent } from './add/add-service.component';
import { EditServiceComponent } from './edit/edit-service.component';
import { ShowServicesComponent } from './show/show-services.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditServiceComponent,
    data: { breadcrumb: 'تعديل الخدمة' }
  },
  {
    path: 'add',
    component: AddServiceComponent,
    data: { breadcrumb: 'اضافة خدمة جديدة' }
  },
  {
    path: 'show',
    component: ShowServicesComponent,
    data: { breadcrumb: 'اظهار جميع الخدمات' }
  },
  {
    path: '',
    redirectTo: 'show',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
