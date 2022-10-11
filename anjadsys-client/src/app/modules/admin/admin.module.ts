import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { AdminComponent } from './admin.component';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceModule } from './service/service.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    AdminComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    ServiceModule,
    SharedModule
  ],
  providers: [AdminService]
})
export class AdminModule { }
