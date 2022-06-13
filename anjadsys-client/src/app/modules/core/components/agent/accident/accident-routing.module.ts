import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAccidentComponent } from './add/add-accident.component';
import { ShowAccidentComponent } from './show/show-accident.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddAccidentComponent
  },
  {
    path: 'show',
    component: ShowAccidentComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccidentRoutingModule { }
