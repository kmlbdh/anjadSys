import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AccidentsAPI, NewAccident, SearchAccident } from '@models/accident';
import {
  CarModelArrayAPI,
  CarsAPI,
  CarTypeArrayAPI,
  NewCar,
  SearchCar,
  SearchCarModel,
  SearchCarType
} from '@models/car';
import { RegionsAPI } from '@models/general';
import {
  InsurancePolicesAPI,
  NewInsurancePolicy,
  SearchInsurancePolicy
} from '@models/insurancepolicy';
import { SearchService, ServicesAPI } from '@models/service';
import { SearchSuppliers } from '@models/supplier';
import { NewUser, SearchUser, UsersAPI, UsersLightAPI } from '@models/user';
import { AccountsAPI, SearchAccount } from '@models/account';
import { environment } from '@environments/environment';
import { EndorsementsAPI, NewEndorsement, SearchEndorsement } from '@models/endorsement';

@Injectable()
export class AgentService {

  private url = environment.apiUrl + 'api/agent/';

  constructor(private http: HttpClient) { }

  verifyLoggedIn = (token: string): Observable<any> =>
    this.http.post<string>(`${ this.url }verify-logged-in`, { token: token })
      .pipe(catchError(this.handleError));

  UsersAPI = {
    show: (searchBy: SearchUser):Observable<UsersAPI> =>
      this.http.post<UsersAPI>(`${ this.url }user/list`, searchBy)
        .pipe(catchError(this.handleError)),

    listActive: (searchBy: SearchUser):Observable<UsersAPI> =>
      this.http.post<UsersAPI>(`${ this.url }user/list-active`, searchBy)
        .pipe(catchError(this.handleError)),

    lightList: (searchBy: SearchUser):Observable<UsersLightAPI> =>
      this.http.post<UsersLightAPI>(`${ this.url }user/list-light`, searchBy)
        .pipe(catchError(this.handleError)),

    listSuppliers: (searchConditions: SearchSuppliers): Observable<any> =>
      this.http.post<any>(`${ this.url }user/list-suppliers`, searchConditions)
        .pipe(catchError(this.handleError)),

    add: (userData: NewUser): Observable<any> =>
      this.http.post<any>(`${ this.url }user/create`, userData)
        .pipe(catchError(this.handleError)),
  };

  ServicesAPIs = {
    list: (searchConditions?: SearchService): Observable<ServicesAPI> =>
      this.http.post<ServicesAPI>(`${ this.url }service/list`, searchConditions)
        .pipe(catchError(this.handleError)),

  };

  CarsAPIs = {
    show: (searchBy: SearchCar):Observable<CarsAPI> =>
      this.http.post<CarsAPI>(`${ this.url }car/list`, searchBy)
        .pipe(catchError(this.handleError)),

    add: (carData: NewCar): Observable<any> => this.http.post<any>(`${ this.url }car/add`, carData)
      .pipe(catchError(this.handleError)),

  };

  CarTypesAPIs = {
    list: (searchCarTypeData: SearchCarType) =>
      this.http.post<CarTypeArrayAPI>(`${ this.url }car-type/list`, searchCarTypeData)
        .pipe(catchError(this.handleError)),

  };

  CarModelsAPIs = {
    list: (searchCarModelData: SearchCarModel) =>
      this.http.post<CarModelArrayAPI>(`${ this.url }car-model/list`, searchCarModelData)
        .pipe(catchError(this.handleError)),

  };

  AccidentsAPI = {
    add: (accidentData: NewAccident):Observable<any> =>
      this.http.post<any>(`${ this.url }accident/add`, accidentData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchAccident):Observable<AccidentsAPI> =>
      this.http.post<AccidentsAPI>(`${ this.url }accident/list`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  GeneralAPIs = {
    regions: ():Observable<RegionsAPI> => this.http.get<RegionsAPI>(`${ this.url }general/regions`)
      .pipe(catchError(this.handleError)),

    statistics: ():Observable<any> => this.http.get<any>(`${ this.url }general/statistics`)
      .pipe(catchError(this.handleError)),

  };

  InsurancePolicesAPI = {
    add: (insurancePolicyData: NewInsurancePolicy):Observable<any> =>
      this.http.post<any>(`${ this.url }insurance-policy/add`, insurancePolicyData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchInsurancePolicy):Observable<InsurancePolicesAPI> =>
      this.http.post<InsurancePolicesAPI>(`${ this.url }insurance-policy/list`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  EndorsementsAPIs = {
    add: (endorsementData: NewEndorsement):Observable<any> =>
      this.http.post<any>(`${ this.url }endorsement/add`, endorsementData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchEndorsement):Observable<EndorsementsAPI> =>
      this.http.post<EndorsementsAPI>(`${ this.url }endorsement/list`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  AccountsAPI = {
    list: (searchBy: SearchAccount):Observable<AccountsAPI> =>
      this.http.post<AccountsAPI>(`${ this.url }account/list`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${ error.status }, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => error);
  }

}
