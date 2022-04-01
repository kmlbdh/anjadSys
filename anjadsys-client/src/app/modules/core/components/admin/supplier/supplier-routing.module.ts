import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show-users/show-users.component';
import { SupplierAccountComponent } from './supplier-account/supplier-account.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowUsersComponent,
    data: {role: 'supplier', title: 'اظهار جميع الموردين'}
  },
  {
    path: 'account/:id',
    component: SupplierAccountComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
