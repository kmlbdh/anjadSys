import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { AddServiceComponent } from './add/add-service.component';
import { ShowServicesComponent } from './show/show-services.component';
import { EditServiceComponent } from './edit/edit-service.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddServiceComponent,
    ShowServicesComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ServiceRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddServiceComponent,
    ShowServicesComponent,
    EditServiceComponent
  ]
})
export class ServiceModule { }
