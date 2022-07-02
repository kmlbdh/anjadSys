import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowServicesComponent } from './show/show-services.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowServicesComponent,
    data: { breadcrumb: 'اظهار جميع الخدمات' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
