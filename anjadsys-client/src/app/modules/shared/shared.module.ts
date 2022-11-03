import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { InsurancePolicyComponent } from './components/insurance-policy-modal/insurance-policy.component';
import { AccidentModalComponent } from './components/accident-modal/accident-modal.component';
import { OtherServiceModalComponent } from './components/other-service-modal/other-service-modal.component';
import { CarModalComponent } from './components/car-modal/car-modal.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AgentLimitsModalComponent } from './components/agent-limits-modal/agent-limits-modal.component';
import { EndorsementModalComponent } from './components/endorsement-modal/endorsement-modal.component';
import { HeaderComponent } from './components/header/header.component';
import { NavItemComponent } from './components/nav-item/nav-item.component';
import { NavItemChildComponent } from './components/nav-item-child/nav-item-child.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchOtherServicesComponent } from './components/search-other-services/search-other-services.component';
import { SearchCarsComponent } from './components/search-cars/search-cars.component';
import { SearchAccidentsComponent } from './components/search-accidents/search-accidents.component';
import { SearchInsurancePoliciesComponent } from './components/search-insurance-policies/search-insurance-policies.component';
import { SearchEndorsementComponent } from './components/search-endorsement/search-endorsement.component';
import { SearchAccountsComponent } from './components/search-accounts/search-accounts.component';
import { SearchSuppAccountComponent } from './components/search-supp-account/search-supp-account.component';
import { StatisticsItemComponent } from './components/statistics-item/statistics-item.component';

@NgModule({
  declarations: [
    NavComponent,
    LoaderComponent,
    InsurancePolicyComponent,
    AccidentModalComponent,
    OtherServiceModalComponent,
    CarModalComponent,
    UserModalComponent,
    BreadcrumbComponent,
    AgentLimitsModalComponent,
    EndorsementModalComponent,
    HeaderComponent,
    NavItemComponent,
    NavItemChildComponent,
    SearchComponent,
    SearchOtherServicesComponent,
    SearchCarsComponent,
    SearchAccidentsComponent,
    SearchInsurancePoliciesComponent,
    SearchEndorsementComponent,
    SearchAccountsComponent,
    SearchSuppAccountComponent,
    StatisticsItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    NavComponent,
    LoaderComponent,
    BreadcrumbComponent,
    HeaderComponent,
    SearchComponent,
    SearchOtherServicesComponent,
    SearchCarsComponent,
    SearchAccidentsComponent,
    SearchInsurancePoliciesComponent,
    SearchEndorsementComponent,
    SearchAccountsComponent,
    SearchSuppAccountComponent,
    StatisticsItemComponent,
  ]
})
export class SharedModule { }
