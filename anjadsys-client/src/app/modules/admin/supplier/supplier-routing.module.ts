import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowUsersComponent } from '../user/show/show-users.component';
import { SupplierAccountComponent } from './account/supplier-account.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowUsersComponent,
    data: { role: 'supplier', breadcrumb: 'اظهار جميع الموردين' }
  },
  {
    path: 'account/:id',
    component: SupplierAccountComponent,
    data: { breadcrumb: 'حساب المورد' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
