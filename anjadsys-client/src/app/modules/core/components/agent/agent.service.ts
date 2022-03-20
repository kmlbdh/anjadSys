import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AccidentsAPI, NewAccident, SearchAccident } from '../../model/accident';
import { CarModelArrayAPI, CarsAPI, CarTypeArrayAPI, NewCar, SearchCar, SearchCarModel, SearchCarType, updateCar, updateCarModel, updateCarType } from '../../model/car';
import { RegionsAPI } from '../../model/general';
import { InsurancePolicesAPI, NewInsurancePolicy, SearchInsurancePolicy } from '../../model/insurancepolicy';
import { SearchService, ServicesAPI } from '../../model/service';
import { SearchSuppliers } from '../../model/supplier';
import { NewUser, SearchUser, UsersAPI, UsersLightAPI } from '../../model/user';
import { AccountsAPI, SearchAccount } from '../../model/account';

@Injectable()
export class AgentService {
  private url = "http://localhost:4200/api/agent/";
  // private url = "https://injad.albayraq.net/api/agent/";

  constructor(private http: HttpClient) { }

  [index: string]: any;

  verifyLoggedInAdmin(token: string): Observable<any>{
    return this.http.post<string>(`${this.url}verify-logged-in`, {token: token}).pipe(
      catchError(this.handleError)
    );
  }

  showUsers(searchBy: SearchUser):Observable<UsersAPI>{
    return this.http.post<UsersAPI>(`${this.url}list-users`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  listNotBlockedUsers(searchBy: SearchUser):Observable<UsersAPI>{
    return this.http.post<UsersAPI>(`${this.url}list-not-block-users`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  listLightUsers(searchBy: SearchUser):Observable<UsersLightAPI>{
    return this.http.post<UsersLightAPI>(`${this.url}list-light-users`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  addUser(userData: NewUser): Observable<any>{
    return this.http.post<any>(`${this.url}create-user`, userData).pipe(
      catchError(this.handleError)
    );
  }

  listSuppliers(searchConditions: SearchSuppliers): Observable<any>{
    return this.http.post<any>(`${this.url}list-suppliers`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  listServices(searchConditions?: SearchService): Observable<ServicesAPI>{
    return this.http.post<ServicesAPI>(`${this.url}list-services`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  showCars(searchBy: SearchCar):Observable<CarsAPI>{
    return this.http.post<CarsAPI>(`${this.url}list-cars`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  addCar(carData: NewCar): Observable<any>{
    return this.http.post<any>(`${this.url}add-car`, carData).pipe(
      catchError(this.handleError)
    );
  }

  listCarTypes(searchCarTypeData: SearchCarType){
    return this.http.post<CarTypeArrayAPI>(`${this.url}list-car-types`, searchCarTypeData).pipe(
      catchError(this.handleError)
    );
  }

  listCarModels(searchCarModelData: SearchCarModel){
    return this.http.post<CarModelArrayAPI>(`${this.url}list-car-models`, searchCarModelData).pipe(
      catchError(this.handleError)
    );
  }

  addAccident(accidentData: NewAccident):Observable<any>{
    return this.http.post<any>(`${this.url}add-accident`, accidentData).pipe(
      catchError(this.handleError)
    );
  }

  listAccidents(searchBy: SearchAccident):Observable<AccidentsAPI>{
    return this.http.post<AccidentsAPI>(`${this.url}list-accidents`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  listRegions():Observable<RegionsAPI>{
    return this.http.get<RegionsAPI>(`${this.url}list-regions`).pipe(
      catchError(this.handleError)
    );
  }

  addInsurancePolicy(insurancePolicyData: NewInsurancePolicy):Observable<any>{
    return this.http.post<any>(`${this.url}add-insurance-policy`, insurancePolicyData)
    .pipe(
      catchError(this.handleError)
    );
  }

  listInsurancePolicy(searchBy: SearchInsurancePolicy):Observable<InsurancePolicesAPI>{
    return this.http.post<InsurancePolicesAPI>(`${this.url}list-insurance-policy`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  listAccounts(searchBy: SearchAccount):Observable<AccountsAPI>{
    return this.http.post<AccountsAPI>(`${this.url}list-accounts`, searchBy).pipe(
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
