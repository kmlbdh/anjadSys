import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface LoginUser{
  data: {
    username: string,
    companyName?: string,
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

  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login = (data: Login): Observable<any> =>
    this.http.post<any>(`${ this.url }api/login`, data);

}
