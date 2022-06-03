import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { InsurancePolicyComponent } from './components/insurance-policy/insurance-policy.component';
import { AccidentModalComponent } from './components/accident-modal/accident-modal.component';
import { OtherServiceModalComponent } from './components/other-service-modal/other-service-modal.component';
import { CarModalComponent } from './components/car-modal/car-modal.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';



@NgModule({
  declarations: [
    NavComponent,
    LoaderComponent,
    InsurancePolicyComponent,
    AccidentModalComponent,
    OtherServiceModalComponent,
    CarModalComponent,
    UserModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    NavComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
