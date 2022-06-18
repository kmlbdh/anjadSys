import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

    return next.handle(newRq)
      .pipe(
          catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
                console.log('This is client side error');
                errorMsg = `Error: ${error.error.message}`;
            } else {
                console.log('This is server side error');
                errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                if(error.status === 401){
                  localStorage.removeItem('user');
                  this.router.navigate(['login']);
                }
            }
            return throwError(() => error);
        })
      )
  }
}
