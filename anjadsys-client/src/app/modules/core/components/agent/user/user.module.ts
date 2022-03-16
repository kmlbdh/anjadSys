import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ShowUsersComponent } from './show-users/show-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowUsersComponent,
    AddUserComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    UserRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
