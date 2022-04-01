import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SupplierAccountComponent } from './supplier-account/supplier-account.component';


@NgModule({
  declarations: [
    SupplierAccountComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class SupplierModule { }
