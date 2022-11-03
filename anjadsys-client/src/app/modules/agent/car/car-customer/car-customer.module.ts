import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarCustomerRoutingModule } from './car-customer-routing.module';
import { AddCarCustomerComponent } from './add/add-car-customer.component';
import { ShowCarCustomerComponent } from './show/show-car-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    AddCarCustomerComponent,
    ShowCarCustomerComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    CarCustomerRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CarCustomerModule { }
