import { updateInsurancePolicy } from '@models/insurancepolicy';
import { updateCar, updateCarModel, updateCarType } from '@models/car';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AgentLimitsArrayAPI, NewAgentLimits, SearchAgentLimits } from '@models/agentlimits';
import { SearchUser, UsersAPI, NewUser, updateUser, UsersLightAPI } from '@models/user';
import { SearchSupplierAccount } from '@models/supplier';
import { SearchService, ServicesAPI } from '@models/service';
import { SearchAgent } from '@models/agent';
import {
  CarsAPI,
  NewCar,
  SearchCar,
  NewCarType,
  NewCarModel,
  SearchCarType,
  CarTypeArrayAPI,
  SearchCarModel,
  CarModelArrayAPI
} from '@models/car';
import { SearchAccident, AccidentsAPI, NewAccident } from '@models/accident';
import { RegionsAPI } from '@models/general';
import {
  NewInsurancePolicy,
  SearchInsurancePolicy,
  InsurancePolicesAPI
} from '@models/insurancepolicy';
import { AccountsAPI, SearchAccount } from '@models/account';
import {
  SearchOtherServices,
  NewOtherService,
  updateOtherService,
  OtherServicesAPI
} from '@models/otherservices';
import { environment } from '@environments/environment';
import { NewEndorsement, updateEndorsement, SearchEndorsement, EndorsementsAPI } from '@models/endorsement';

@Injectable()
export class AdminService {

  private url = environment.apiUrl + 'api/admin/';

  constructor(private http: HttpClient) { }

  [index: string]: any;

  verifyLoggedIn = (token: string): Observable<any> =>
    this.http.post<string>(`${ this.url }verify-logged-in`, { token: token })
      .pipe(catchError(this.handleError));

  UsersAPIs = {
    list: (searchBy: SearchUser): Observable<UsersAPI> =>
      this.http.post<UsersAPI>(`${ this.url }user/list`, searchBy)
        .pipe(catchError(this.handleError)),

    lightlist: (searchBy: SearchUser): Observable<UsersLightAPI> =>
      this.http.post<UsersLightAPI>(`${ this.url }user/list-light`, searchBy)
        .pipe(catchError(this.handleError)),

    delete: (userID: string): Observable<any> => this.http.delete<any>(`${ this.url }user/${ userID }`)
      .pipe(catchError(this.handleError)),

    add: (userData: NewUser): Observable<any> =>
      this.http.post<any>(`${ this.url }user/create`, userData)
        .pipe(catchError(this.handleError)),

    update: (userID: string, userData: updateUser): Observable<any> =>
      this.http.put<any>(`${ this.url }user/${ userID }`, userData)
        .pipe(catchError(this.handleError))

  };


  SuppliersAPIs = {
    add: (userData: NewUser): Observable<any> =>
      this.http.post<any>(`${ this.url }supplier/create`, userData)
        .pipe(catchError(this.handleError)),

    listAccount: (searchBy: SearchSupplierAccount):Observable<any> =>
      this.http.post<any>(`${ this.url }supplier/account`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  ServicesAPIs = {
    list: (searchConditions?: SearchService): Observable<ServicesAPI> =>
      this.http.post<ServicesAPI>(`${ this.url }service/list`, searchConditions)
        .pipe(catchError(this.handleError)),

    delete: (serviceID: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }service/${ serviceID }`)
        .pipe(catchError(this.handleError)),

    add: (service: Partial<ServicesAPI>) => this.http.post<any>(`${ this.url }service/add`, service)
      .pipe(catchError(this.handleError)),

    update: (serviceID: number, service: Partial<ServicesAPI>) =>
      this.http.put<any>(`${ this.url }service/${ serviceID }`, service)
        .pipe(catchError(this.handleError)),

  };

  AgentLimitsAPIs = {
    listAgents: (searchConditions: SearchAgent): Observable<any> => {
      searchConditions.role = 'agent';
      return this.UsersAPIs.list(searchConditions as SearchUser)
        .pipe(catchError(this.handleError));
    },
    add: (agentLimitsData: NewAgentLimits) =>
      this.http.post<any>(`${ this.url }agent-limits/add`, agentLimitsData)
        .pipe(catchError(this.handleError)),

    listLimits: (searchAgentLimits: SearchAgentLimits) =>
      this.http.post<AgentLimitsArrayAPI>(`${ this.url }agent-limits/list`, searchAgentLimits)
        .pipe(catchError(this.handleError)),

    delete: (id: string) => this.http.delete<any>(`${ this.url }agent-limits/${ id }`)
      .pipe(catchError(this.handleError)),

  };

  CarsAPIs = {
    delete: (carId: string): Observable<any> => this.http.delete<any>(`${ this.url }car/${ carId }`)
      .pipe(catchError(this.handleError)),

    show: (searchBy: SearchCar):Observable<CarsAPI> =>
      this.http.post<CarsAPI>(`${ this.url }car/list`, searchBy)
        .pipe(catchError(this.handleError)),

    add: (carData: NewCar): Observable<any> => this.http.post<any>(`${ this.url }car/add`, carData)
      .pipe(catchError(this.handleError)),

    update: (carId: number, carData: updateCar): Observable<any> =>
      this.http.put<any>(`${ this.url }car/${ carId }`, carData)
        .pipe(catchError(this.handleError)),

  };

  CarTypesAPIs = {
    add: (carTypeData: NewCarType): Observable<any> =>
      this.http.post<any>(`${ this.url }car-type/add`, carTypeData)
        .pipe(catchError(this.handleError)),

    list: (searchCarTypeData: SearchCarType) =>
      this.http.post<CarTypeArrayAPI>(`${ this.url }car-type/list`, searchCarTypeData)
        .pipe(catchError(this.handleError)),

    delete: (carTypeId: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }car-type/${ carTypeId }`)
        .pipe(catchError(this.handleError)),

    update: (carTypeId: number, carModelData: updateCarType): Observable<any> =>
      this.http.put<any>(`${ this.url }car-type/${ carTypeId }`, carModelData)
        .pipe(catchError(this.handleError)),
  };

  CarModelsAPIs = {
    add: (carModelData: NewCarModel): Observable<any> =>
      this.http.post<any>(`${ this.url }car-model/add`, carModelData)
        .pipe(catchError(this.handleError)),

    list: (searchCarModelData: SearchCarModel) =>
      this.http.post<CarModelArrayAPI>(`${ this.url }car-model/list`, searchCarModelData)
        .pipe(catchError(this.handleError)),

    delete: (carModelId: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }car-model/${ carModelId }`)
        .pipe(catchError(this.handleError)),

    update: (carModelId: number, carModelData: updateCarModel): Observable<any> =>
      this.http.put<any>(`${ this.url }car-model/${ carModelId }`, carModelData)
        .pipe(catchError(this.handleError)),

  };


  AccidentsAPIs = {
    add: (accidentData: NewAccident):Observable<any> =>
      this.http.post<any>(`${ this.url }accident/add`, accidentData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchAccident):Observable<AccidentsAPI> =>
      this.http.post<AccidentsAPI>(`${ this.url }accident/list`, searchBy)
        .pipe(catchError(this.handleError)),

    update: (accidentId: number, accidentData: NewAccident):Observable<any> =>
      this.http.put<any>(`${ this.url }accident/${ accidentId }`, accidentData)
        .pipe(catchError(this.handleError)),

    delete: (accidentID: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }accident/${ accidentID }`)
        .pipe(catchError(this.handleError)),

  };

  InsurancePoliciesAPIs = {
    add: (insurancePolicyData: NewInsurancePolicy):Observable<any> =>
      this.http.post<any>(`${ this.url }insurance-policy/add`, insurancePolicyData)
        .pipe(catchError(this.handleError)),

    update: (insurancePolicyId: number, insurancePolicyData: updateInsurancePolicy):Observable<any> =>
      this.http.put<any>(`${ this.url }insurance-policy/${ insurancePolicyId }`, insurancePolicyData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchInsurancePolicy):Observable<InsurancePolicesAPI> =>
      this.http.post<InsurancePolicesAPI>(`${ this.url }insurance-policy/list`, searchBy)
        .pipe(catchError(this.handleError)),

    delete: (insurancePolicyId: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }insurance-policy/${ insurancePolicyId }`)
        .pipe(catchError(this.handleError)),

  };

  EndorsementsAPIs = {
    add: (endorsementData: NewEndorsement):Observable<any> =>
      this.http.post<any>(`${ this.url }endorsement/add`, endorsementData)
        .pipe(catchError(this.handleError)),

    update: (endorsementId: number, endorsementData: updateEndorsement):Observable<any> =>
      this.http.put<any>(`${ this.url }endorsement/${ endorsementId }`, endorsementData)
        .pipe(catchError(this.handleError)),

    list: (searchBy: SearchEndorsement):Observable<EndorsementsAPI> =>
      this.http.post<EndorsementsAPI>(`${ this.url }endorsement/list`, searchBy)
        .pipe(catchError(this.handleError)),

    delete: (endorsementId: number): Observable<any> =>
      this.http.delete<any>(`${ this.url }endorsement/${ endorsementId }`)
        .pipe(catchError(this.handleError)),

  };

  OtherServicesAPIs = {
    delete: (otherServiceID: string): Observable<any> =>
      this.http.delete<any>(`${ this.url }other-service/${ otherServiceID }`)
        .pipe(catchError(this.handleError)),

    show: (searchBy: SearchOtherServices):Observable<OtherServicesAPI> =>
      this.http.post<OtherServicesAPI>(`${ this.url }other-service/list`, searchBy)
        .pipe(catchError(this.handleError)),

    add: (otherServiceData: NewOtherService): Observable<any> =>
      this.http.post<any>(`${ this.url }other-service/add`, otherServiceData)
        .pipe(catchError(this.handleError)),

    update: (otherServiceID: number, otherServiceData: updateOtherService): Observable<any> =>
      this.http.put<any>(`${ this.url }other-service/${ otherServiceID }`, otherServiceData)
        .pipe(catchError(this.handleError)),

  };

  AccountsAPIs = {
    list: (searchBy: SearchAccount):Observable<AccountsAPI> =>
      this.http.post<AccountsAPI>(`${ this.url }account/list`, searchBy)
        .pipe(catchError(this.handleError)),

  };

  GeneralAPIs = {
    regionsAndRoles: () => this.http.get<any>(`${ this.url }general/regions-roles`)
      .pipe(catchError(this.handleError)),

    regions: ():Observable<RegionsAPI> => this.http.get<RegionsAPI>(`${ this.url }general/regions`)
      .pipe(catchError(this.handleError)),

    statistics: ():Observable<any> => this.http.get<any>(`${ this.url }general/statistics`)
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
    // return throwError(() => new Error('Something bad happened; please try again later.'));
    return throwError(() => error);
  }

}
