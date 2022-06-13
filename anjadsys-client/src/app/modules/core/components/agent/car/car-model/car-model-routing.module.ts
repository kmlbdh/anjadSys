import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCarModelsComponent } from './show/show-car-models.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarModelsComponent,
    data: {breadcrumb: 'اظهار جميع موديلات السيارات'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
