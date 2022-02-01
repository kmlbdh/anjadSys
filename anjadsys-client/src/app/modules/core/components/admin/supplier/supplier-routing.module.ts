import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show-users/show-users.component';
import { ListSupplierPartsComponent } from './list-supplier-parts/list-supplier-parts.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowUsersComponent,
    data: {role: 'supplier', title: 'اظهار جميع الموردين للشركة'}
  },
  {
    path: 'list-supplier-parts/:id',
    component: ListSupplierPartsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
