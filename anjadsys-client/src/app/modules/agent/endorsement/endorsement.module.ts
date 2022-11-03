import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementRoutingModule } from './endorsement-routing.module';
import { ShowEndorsementsComponent } from './show-endorsements/show-endorsements.component';
import { AddEndorsementComponent } from './add-endorsement/add-endorsement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ShowEndorsementsComponent,
    AddEndorsementComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    EndorsementRoutingModule,
    SharedModule
  ]
})
export class EndorsementModule { }
