import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoggedInAPI } from '../../core/model/general';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRq = request.clone();

    if(!request.url.includes('login')){
      const storedUser: string | null = localStorage.getItem('user');

      if(!storedUser){
        this.router.navigate(['login']);
        return next.handle(request);
      }

      const user: UserLoggedInAPI = JSON.parse(storedUser);
      const token: string = user.accessToken;

      newRq = request.clone({
        headers: request.headers.set('x-access-token', token)
      });
    }

    return next.handle(newRq);
      // .pipe(
      //   tap(evt => {
      //     console.log(evt)
      //     if (evt instanceof HttpResponse)
      //       console.warn(evt);
      //   }),
      // );
  }
}
