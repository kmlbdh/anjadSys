import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCarModelsComponent } from './show-car-models/show-car-models.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarModelsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
