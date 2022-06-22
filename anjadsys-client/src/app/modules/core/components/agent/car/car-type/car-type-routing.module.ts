import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCarTypesComponent } from './show/show-car-types.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarTypesComponent,
    data: { breadcrumb: 'اظهار جميع انواع السيارات' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarTypeRoutingModule { }
