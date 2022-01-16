import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ShowUsersComponent } from './show-users/show-users.component';

const routes: Routes = [
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
  },
  {
    path: 'show-users',
    component: ShowUsersComponent,
    data: {title: 'اظهار كافة مستخدمي النظام'}
  },
  {
    path: 'add-user',
    component: AddUserComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
