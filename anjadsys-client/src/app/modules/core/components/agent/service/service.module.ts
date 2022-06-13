import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ShowServicesComponent } from './show/show-services.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowServicesComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
