import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarCustomerRoutingModule } from './car-customer-routing.module';
import { AddCarCustomerComponent } from './add-car-customer/add-car-customer.component';
import { ShowCarCustomerComponent } from './show-car-customer/show-car-customer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


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
    FontAwesomeModule,
  ]
})
export class CarCustomerModule { }
