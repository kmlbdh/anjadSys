import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private url = "http://localhost:4200/api/";
  // private url = "https://injad.albayraq.net/api/";

  constructor(private http: HttpClient) { }

  login(data: Login): Observable<any>{
    return this.http.post<any>(`${this.url}login`, data)
  }
}
