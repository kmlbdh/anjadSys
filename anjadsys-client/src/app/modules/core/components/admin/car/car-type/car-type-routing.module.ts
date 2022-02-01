import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCarTypeComponent } from './edit-car-type/edit-car-type.component';
import { ShowCarTypesComponent } from './show-car-types/show-car-types.component';
import { AddCarTypeComponent } from './add-car-type/add-car-type.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditCarTypeComponent,
  },
  {
    path: 'show',
    component: ShowCarTypesComponent,
  },
  {
    path: 'add',
    component: AddCarTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarTypeRoutingModule { }
