import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAccidentComponent } from './add-accident/add-accident.component';
import { EditAccidentComponent } from './edit-accident/edit-accident.component';
import { ShowAccidentComponent } from './show-accident/show-accident.component';

const routes: Routes = [

  {
    path: 'edit/:id',
    component: EditAccidentComponent
  },
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
