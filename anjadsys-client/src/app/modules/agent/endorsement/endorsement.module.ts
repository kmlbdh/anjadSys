import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementRoutingModule } from './endorsement-routing.module';
import { ShowEndorsementsComponent } from './show-endorsements/show-endorsements.component';
import { AddEndorsementComponent } from './add-endorsement/add-endorsement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ShowEndorsementsComponent,
    AddEndorsementComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    EndorsementRoutingModule
  ]
})
export class EndorsementModule { }
