import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { tap, Observable, catchError } from 'rxjs';
import { Router } from '@angular/router';

interface User{
  username: string,
  nickname: string,
  role: string,
  accessToken: string
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const storedUser: string | null = localStorage.getItem('user');

    if(!storedUser){
      this.router.navigate(['login']);
      return next.handle(request);
    }

    const user: User = JSON.parse(storedUser);
    const token: string = user.accessToken;

    let newRq = request.clone({
      headers: request.headers.set('x-access-token', token)
    });
    console.info(newRq);
    return next.handle(newRq).pipe(
      tap(evt =>{
        if (evt instanceof HttpResponse)
          console.warn(evt)
      } )
    );
  }
}
