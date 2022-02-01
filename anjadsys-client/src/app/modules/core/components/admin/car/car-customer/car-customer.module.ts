import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarCustomerRoutingModule } from './car-customer-routing.module';
import { AddCarCustomerComponent } from './add-car-customer/add-car-customer.component';
import { EditCarCustomerComponent } from './edit-car-customer/edit-car-customer.component';
import { ShowCarCustomerComponent } from './show-car-customer/show-car-customer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddCarCustomerComponent,
    EditCarCustomerComponent,
    ShowCarCustomerComponent
  ],
  imports: [
    CommonModule,
    CarCustomerRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class CarCustomerModule { }
