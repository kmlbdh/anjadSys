import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarModelRoutingModule } from './car-model-routing.module';
import { ShowCarModelsComponent } from './show/show-car-models.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowCarModelsComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    CarModelRoutingModule
  ]
})
export class CarModelModule { }
