import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddInsurancePolicyComponent } from './add/add-insurance-policy.component';
import { EditInsurancePolicyComponent } from './edit/edit-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show/show-insurance-policy.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AddInsurancePolicyComponent,
    EditInsurancePolicyComponent,
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
