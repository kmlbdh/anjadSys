import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCarModelComponent } from './edit-car-model/edit-car-model.component';
import { ShowCarModelsComponent } from './show-car-models/show-car-models.component';
import { AddCarModelComponent } from './add-car-model/add-car-model.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditCarModelComponent,
  },
  {
    path: 'show',
    component: ShowCarModelsComponent,
  },
  {
    path: 'add',
    component: AddCarModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarModelRoutingModule { }
