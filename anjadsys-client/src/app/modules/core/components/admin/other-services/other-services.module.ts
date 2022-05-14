import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherServicesRoutingModule } from './other-services-routing.module';
import { AddOtherservicesComponent } from './add-otherservices/add-otherservices.component';
import { ShowOtherservicesComponent } from './show-otherservices/show-otherservices.component';
import { EditOtherservicesComponent } from './edit-otherservices/edit-otherservices.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddOtherservicesComponent,
    ShowOtherservicesComponent,
    EditOtherservicesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FontAwesomeModule,
    OtherServicesRoutingModule
  ]
})
export class OtherServicesModule { }
