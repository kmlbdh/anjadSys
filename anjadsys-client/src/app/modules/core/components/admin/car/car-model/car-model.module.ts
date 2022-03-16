import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarModelRoutingModule } from './car-model-routing.module';
import { AddCarModelComponent } from './add-car-model/add-car-model.component';
import { EditCarModelComponent } from './edit-car-model/edit-car-model.component';
import { ShowCarModelsComponent } from './show-car-models/show-car-models.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddCarModelComponent,
    EditCarModelComponent,
    ShowCarModelsComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    CarModelRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ]
})
export class CarModelModule { }
