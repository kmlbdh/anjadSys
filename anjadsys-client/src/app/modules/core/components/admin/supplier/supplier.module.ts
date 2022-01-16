import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { AddSupplierPartsComponent } from './add-supplier-parts/add-supplier-parts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ListSupplierPartsComponent } from './list-supplier-parts/list-supplier-parts.component';


@NgModule({
  declarations: [
    AddSupplierPartsComponent,
    ListSupplierPartsComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class SupplierModule { }
