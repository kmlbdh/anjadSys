import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowAccountComponent } from './show/show-account.component';

const routes: Routes = [{
  path: 'show',
  component: ShowAccountComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
