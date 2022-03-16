import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { tap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserLoggedInAPI } from '../../core/model/general';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const storedUser: string | null = localStorage.getItem('user');

    if(!storedUser){
      this.router.navigate(['login']);
      return next.handle(request);
    }

    const user: UserLoggedInAPI = JSON.parse(storedUser);
    const token: string = user.accessToken;

    let newRq = request.clone({
      headers: request.headers.set('x-access-token', token)
    });
    return next.handle(newRq).pipe(
      tap(evt =>{
        if (evt instanceof HttpResponse)
          console.warn(evt);
      } )
    );
  }
}
