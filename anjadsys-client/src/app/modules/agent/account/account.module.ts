import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowAccountComponent } from './show/show-account.component';


@NgModule({
  declarations: [
    ShowAccountComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class AccountModule { }
