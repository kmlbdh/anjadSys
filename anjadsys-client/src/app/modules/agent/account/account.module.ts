import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowAccountComponent } from './show/show-account.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ShowAccountComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AccountModule { }
