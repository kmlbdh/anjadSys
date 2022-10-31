import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEndorsementComponent } from './add-endorsement/add-endorsement.component';
import { ShowEndorsementsComponent } from './show-endorsements/show-endorsements.component';

const routes: Routes = [
  {
    path:'add',
    component: AddEndorsementComponent,
    data: { breadcrumb: 'اضافة ملحق جديد' }
  },
  {
    path:'show',
    component: ShowEndorsementsComponent,
    data: { breadcrumb: 'اظهار جميع الملحقات' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndorsementRoutingModule { }
