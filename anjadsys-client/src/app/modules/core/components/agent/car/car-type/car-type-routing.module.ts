import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowCarTypesComponent } from './show-car-types/show-car-types.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowCarTypesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarTypeRoutingModule { }
