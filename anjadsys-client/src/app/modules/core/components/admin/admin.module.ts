import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';
import { AdminComponent } from './admin.component';
import { NavComponent } from './nav/nav.component';
import { ShowUsersComponent } from './show-users/show-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddAgentLimitsComponent } from './add-agent-limits/add-agent-limits.component';
import { AddSupplierPartsComponent } from './add-supplier-parts/add-supplier-parts.component';


@NgModule({
  declarations: [
    AdminComponent,
    NavComponent,
    ShowUsersComponent,
    AddUserComponent,
    MainComponent,
    AddAgentLimitsComponent,
    AddSupplierPartsComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AdminService]
})
export class AdminModule { }
