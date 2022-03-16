import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccidentRoutingModule } from './accident-routing.module';
import { AddAccidentComponent } from './add-accident/add-accident.component';
import { EditAccidentComponent } from './edit-accident/edit-accident.component';
import { ShowAccidentComponent } from './show-accident/show-accident.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddAccidentComponent,
    EditAccidentComponent,
    ShowAccidentComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    AccidentRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ]
})
export class AccidentModule { }
