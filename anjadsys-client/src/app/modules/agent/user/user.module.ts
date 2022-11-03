import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ShowUsersComponent } from './show/show-users.component';
import { AddUserComponent } from './add/add-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ShowUsersComponent,
    AddUserComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
