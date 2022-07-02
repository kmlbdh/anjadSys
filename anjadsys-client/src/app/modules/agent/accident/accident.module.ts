import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccidentRoutingModule } from './accident-routing.module';
import { AddAccidentComponent } from './add/add-accident.component';
import { ShowAccidentComponent } from './show/show-accident.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddAccidentComponent,
    ShowAccidentComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    AccidentRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class AccidentModule { }
