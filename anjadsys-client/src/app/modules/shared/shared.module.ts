import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavComponent } from './components/nav/nav.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';



@NgModule({
  declarations: [
    NavComponent,
    LoaderComponent
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
