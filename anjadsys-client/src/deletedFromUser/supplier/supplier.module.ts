import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { ShowSuppliersComponent } from './show-suppliers/show-suppliers.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowSuppliersComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
