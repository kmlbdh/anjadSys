import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarTypeRoutingModule } from './car-type-routing.module';
import { ShowCarTypesComponent } from './show/show-car-types.component';
import { EditCarTypeComponent } from './edit/edit-car-type.component';
import { AddCarTypeComponent } from './add/add-car-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowCarTypesComponent,
    EditCarTypeComponent,
    AddCarTypeComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    CarTypeRoutingModule
  ]
})
export class CarTypeModule { }
