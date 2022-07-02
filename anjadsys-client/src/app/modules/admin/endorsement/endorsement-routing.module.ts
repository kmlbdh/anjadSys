import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEndorsementComponent } from './edit/edit-endorsement.component';
import { AddEndorsementComponent } from './add/add-endorsement.component';
import { ShowEndorsementsComponent } from './show/show-endorsements.component';

const routes: Routes = [
  {
    path:'edit/:id',
    component: EditEndorsementComponent,
    data: { breadcrumb: 'تعديل بيانات الملحق' }
  },
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
