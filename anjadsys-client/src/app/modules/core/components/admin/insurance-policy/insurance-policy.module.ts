import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePolicyRoutingModule } from './insurance-policy-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AddInsurancePolicyComponent } from './add-insurance-policy/add-insurance-policy.component';
import { EditInsurancePolicyComponent } from './edit-insurance-policy/edit-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show-insurance-policy/show-insurance-policy.component';


@NgModule({
  declarations: [
    AddInsurancePolicyComponent,
    EditInsurancePolicyComponent,
    ShowInsurancePolicyComponent
  ],
  imports: [
    CommonModule,
    InsurancePolicyRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ]
})
export class InsurancePolicyModule { }
