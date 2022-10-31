import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherServicesRoutingModule } from './other-services-routing.module';
import { AddOtherservicesComponent } from './add/add-otherservices.component';
import { ShowOtherservicesComponent } from './show/show-otherservices.component';
import { EditOtherservicesComponent } from './edit/edit-otherservices.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


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
    OtherServicesRoutingModule,
    SharedModule
  ]
})
export class OtherServicesModule { }
