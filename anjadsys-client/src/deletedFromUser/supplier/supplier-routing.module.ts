import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowSuppliersComponent } from './show-suppliers/show-suppliers.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowSuppliersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
