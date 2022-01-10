import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface User{
  id: string,
  username: string,
  nickname: string,
  role: string,
  accessToken: string
}

export interface Users{
  data:[{
    _id: string,
    username: string,
    nickname: string,
    role: string,
    phone: number,
    address: string,
    tel: number,
    created_at: Date,
    updated_at: Date
  }]
}

export interface regUser{
    username: string,
    nickname?: string,
    password: string,
    confirmPassword: string,
    role: string,
    phone?: number,
    tel?: number,
    address?: string,
    note?: string
}

export interface SearchUser {
  skip?:number,
  limit?: number,
  userID?: string,
  role?: string,
  agentID?: string,
  nickname?: string
}

export interface agentLimits{
  limitAmount: number,
  agentID: string
}

export interface supplierParts{
  partNo?: number,
  partName: string,
  quantity: number,
  cost: number,
  supplierID: string
}

export interface listSupplierSearch{
    role?: string,
    limit?: number,
    skip?: number,
    agentID?: string,
    userID?: string,
    nickname?: string,
    username?: string,
}

export interface listAgentSearch{
    role?: string,
    limit?: number,
    skip?: number,
    userID?: string,
    nickname?: string,
    username?: string,
}

export interface supplier{
    username: string,
    nickname: string,
    address: string,
    tel: number,
    phone: number,
    role: string,
}

@Injectable()
export class AdminService {
  private url = "http://localhost:4200/api/admin/";
  constructor(private http: HttpClient) { }

  verifyLoggedInAdmin(token: string): Observable<any>{
    return this.http.post<string>(this.url + "verify-logged-in", {token: token}).pipe(
      catchError(this.handleError)
    );
  }
  showUsers(searchBy: SearchUser):Observable<Users>{
    return this.http.post<Users>(this.url + "list-users", searchBy).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<any>{
    return this.http.post<any>(this.url + "delete-user", {username: id}).pipe(
      catchError(this.handleError)
    );
  }

  addUser(userData: regUser): Observable<any>{
    return this.http.post<any>(this.url + "create-user", userData).pipe(
      catchError(this.handleError)
    );
  }

  addSupplier(userData: regUser): Observable<any>{
    return this.http.post<any>(this.url + "create-supplier", userData).pipe(
      catchError(this.handleError)
    );
  }

  listSuppliers(searchConditions: listSupplierSearch): Observable<any>{
    searchConditions.role = "supplier";
    return this.http.post<any>(this.url + "list-users", searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  addSupplierParts(supplierPartsData: supplierParts){
    return this.http.post<any>(this.url + "add-supplier-part", supplierPartsData).pipe(
      catchError(this.handleError)
    );
  }

  listAgents(searchConditions: listAgentSearch): Observable<any>{
    searchConditions.role = "agent";
    return this.http.post<any>(this.url + "list-users", searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  addAgentLimits(agentLimitsData: agentLimits){
    return this.http.post<any>(this.url + "add-agent-limits", agentLimitsData).pipe(
      catchError(this.handleError)
    );
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
