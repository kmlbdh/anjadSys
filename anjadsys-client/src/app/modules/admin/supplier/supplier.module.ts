import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SupplierAccountComponent } from './account/supplier-account.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    SupplierAccountComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SupplierModule { }
