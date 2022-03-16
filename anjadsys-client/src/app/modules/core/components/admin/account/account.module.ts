import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowAccountComponent } from './show-account/show-account.component';


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
