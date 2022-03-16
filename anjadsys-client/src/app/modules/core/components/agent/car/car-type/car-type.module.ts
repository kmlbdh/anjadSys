import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarTypeRoutingModule } from './car-type-routing.module';
import { ShowCarTypesComponent } from './show-car-types/show-car-types.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowCarTypesComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    CarTypeRoutingModule
  ]
})
export class CarTypeModule { }
