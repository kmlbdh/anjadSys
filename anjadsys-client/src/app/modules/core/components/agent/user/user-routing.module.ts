import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add/add-user.component';
import { ShowUsersComponent } from './show/show-users.component';

const routes: Routes = [
  {
    path: 'show',
    component: ShowUsersComponent,
    data: {breadcrumb: 'اظهار جميع الزبائن'}
  },
  {
    path: 'add',
    component: AddUserComponent,
    data: {breadcrumb: 'اضافة زبون جديد'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
