import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInsurancePolicyComponent } from './add-insurance-policy/add-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show-insurance-policy/show-insurance-policy.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddInsurancePolicyComponent
  },
  {
    path: 'show',
    component: ShowInsurancePolicyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancePolicyRoutingModule { }
