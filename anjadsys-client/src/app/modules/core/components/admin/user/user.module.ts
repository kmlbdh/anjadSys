import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { AddUserComponent } from './add/add-user.component';
import { EditUserComponent } from './edit/edit-user.component';
import { ShowUsersComponent } from './show/show-users.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddUserComponent,
    EditUserComponent,
    ShowUsersComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
