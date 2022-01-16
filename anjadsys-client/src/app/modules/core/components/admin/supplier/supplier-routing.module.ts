import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show-users/show-users.component';
import { AddSupplierPartsComponent } from './add-supplier-parts/add-supplier-parts.component';
import { ListSupplierPartsComponent } from './list-supplier-parts/list-supplier-parts.component';

const routes: Routes = [
  {
    path: 'show-supplier',
    component: ShowUsersComponent,
    data: {role: 'supplier', title: 'اظهار جميع الموردين للشركة'}
  },
  {
    path: 'add-supplier-parts',
    component: AddSupplierPartsComponent
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
