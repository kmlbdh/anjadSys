import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarTypeRoutingModule } from './car-type-routing.module';
import { ShowCarTypesComponent } from './show-car-types/show-car-types.component';
import { EditCarTypeComponent } from './edit-car-type/edit-car-type.component';
import { AddCarTypeComponent } from './add-car-type/add-car-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ShowCarTypesComponent,
    EditCarTypeComponent,
    AddCarTypeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CarTypeRoutingModule
  ]
})
export class CarTypeModule { }
