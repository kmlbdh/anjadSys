import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementRoutingModule } from './endorsement-routing.module';
import { AddEndorsementComponent } from './add/add-endorsement.component';
import { EditEndorsementComponent } from './edit/edit-endorsement.component';
import { ShowEndorsementsComponent } from './show/show-endorsements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AddEndorsementComponent,
    EditEndorsementComponent,
    ShowEndorsementsComponent
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
