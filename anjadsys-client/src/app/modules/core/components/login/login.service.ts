import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface LoginUser{
  data: {
    username: string,
    nickname: string,
    role: string,
    accessToken: string
  },
  message?: string
}

export interface Login{
  username: string,
  password: string
}

@Injectable()
export class LoginService {
  private url = "http://localhost:4200/api/login";

  constructor(private http: HttpClient) { }

  login(data: Login): Observable<any>{
    return this.http.post<LoginUser>(this.url, data)
    .pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    // return throwError(() => new Error('Something bad happened; please try again later.'));
    return throwError(() => error);
  }
}
