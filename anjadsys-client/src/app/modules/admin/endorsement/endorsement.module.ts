import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementRoutingModule } from './endorsement-routing.module';
import { AddEndorsementComponent } from './add/add-endorsement.component';
import { EditEndorsementComponent } from './edit/edit-endorsement.component';
import { ShowEndorsementsComponent } from './show/show-endorsements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';


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
    FontAwesomeModule,
    EndorsementRoutingModule
  ]
})
export class EndorsementModule { }
