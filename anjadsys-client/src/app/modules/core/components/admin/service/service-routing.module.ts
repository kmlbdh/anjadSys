import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddServiceComponent } from './add-service/add-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ShowServicesComponent } from './show-services/show-services.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditServiceComponent
  },
  {
    path: 'add',
    component: AddServiceComponent
  },
  {
    path: 'show',
    component: ShowServicesComponent,
  },
  {
    path: '',
    redirectTo: 'show',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
