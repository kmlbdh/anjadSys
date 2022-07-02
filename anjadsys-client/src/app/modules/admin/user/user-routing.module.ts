import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';
import { ShowUsersComponent } from './show/show-users.component';

const routes: Routes = [
  {
    path: 'edit/:id',
    component: EditUserComponent,
    data: { breadcrumb: 'تعديل بيانات المستخدم' }
  },
  {
    path: 'show',
    component: ShowUsersComponent,
    data: { breadcrumb: 'اظهار كافة مستخدمي النظام' }
  },
  {
    path: 'add',
    component: AddUserComponent,
    data: { breadcrumb: 'اضافة مستخدم جديد' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
