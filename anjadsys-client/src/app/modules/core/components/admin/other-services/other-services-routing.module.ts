import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOtherservicesComponent } from './add-otherservices/add-otherservices.component';
import { ShowOtherservicesComponent } from './show-otherservices/show-otherservices.component';
import { EditOtherservicesComponent } from './edit-otherservices/edit-otherservices.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditOtherservicesComponent,
  },
  {
    path: 'show',
    component: ShowOtherservicesComponent,
  },
  {
    path: 'add',
    component: AddOtherservicesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherServicesRoutingModule { }
