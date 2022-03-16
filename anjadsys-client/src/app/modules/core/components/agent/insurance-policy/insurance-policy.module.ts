import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { AddInsurancePolicyComponent } from './add-insurance-policy/add-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show-insurance-policy/show-insurance-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AddInsurancePolicyComponent,
    ShowInsurancePolicyComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    InsurancePolicyRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class InsurancePolicyModule { }
