import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddInsurancePolicyComponent } from './add/add-insurance-policy.component';
import { ShowInsurancePolicyComponent } from './show/show-insurance-policy.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddInsurancePolicyComponent,
    data: {breadcrumb: 'اضافة بوليصة تأمين جديد'}
  },
  {
    path: 'show',
    component: ShowInsurancePolicyComponent,
    data: {breadcrumb: 'اظهار جميع بوالص التأمين'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancePolicyRoutingModule { }
