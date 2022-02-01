import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ShowUsersComponent } from './show-users/show-users.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditUserComponent,
  },
  {
    path: 'show',
    component: ShowUsersComponent,
    data: {title: 'اظهار كافة مستخدمي النظام'}
  },
  {
    path: 'add',
    component: AddUserComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
