import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { AddInsurancePolicyComponent } from './add/add-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show/show-insurance-policy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


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
    SharedModule
  ]
})
export class InsurancePolicyModule { }
