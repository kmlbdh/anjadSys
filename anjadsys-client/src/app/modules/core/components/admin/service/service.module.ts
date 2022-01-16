import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { AddServiceComponent } from './add-service/add-service.component';
import { ShowServicesComponent } from './show-services/show-services.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AddServiceComponent,
    ShowServicesComponent,
    EditServiceComponent
  ],
  imports: [
    CommonModule,
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
