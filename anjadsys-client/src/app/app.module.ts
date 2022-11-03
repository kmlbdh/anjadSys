import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './modules/core/interceptors/auth.interceptor';
import { SharedModule } from './modules/shared/shared.module';
import { LoaderInterceptor } from './modules/core/interceptors/loader.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginModule } from './modules/login/login.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

