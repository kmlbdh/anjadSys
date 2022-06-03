import { updateInsurancePolicy } from './../../model/insurancepolicy';
import { updateCar, updateCarModel, updateCarType } from './../../model/car';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AgentLimitsArrayAPI, NewAgentLimits, SearchAgentLimits } from '../../model/agentlimits';
import { SearchUser, UsersAPI, NewUser, updateUser, UsersLightAPI } from '../../model/user';
import { SearchSupplierAccount } from '../../model/supplier';
import { SearchService, ServicesAPI } from '../../model/service';
import { SearchAgent } from '../../model/agent';
import { CarsAPI, NewCar, SearchCar, NewCarType, NewCarModel, SearchCarType, CarTypeArrayAPI, SearchCarModel, CarModelArrayAPI } from '../../model/car';
import { SearchAccident, AccidentsAPI, NewAccident } from '../../model/accident';
import { RegionsAPI } from '../../model/general';
import { NewInsurancePolicy, SearchInsurancePolicy, InsurancePolicesAPI } from '../../model/insurancepolicy';
import { AccountsAPI, SearchAccount } from '../../model/account';
import { SearchOtherServices, NewOtherService, updateOtherService, OtherServicesAPI } from '../../model/otherservices';
import { environment } from '../../../../../environments/environment';
@Injectable()
export class AdminService {
  private url = environment.apiUrl + 'api/admin/';

  constructor(private http: HttpClient) { }

  [index: string]: any;

  verifyLoggedInAdmin(token: string): Observable<any>{
    return this.http.post<string>(`${this.url}verify-logged-in`, {token: token}).pipe(
      catchError(this.handleError)
    );
  }

  UsersAPIs = {
    list: (searchBy: SearchUser):Observable<UsersAPI> => {
      return this.http.post<UsersAPI>(`${this.url}user/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    lightlist: (searchBy: SearchUser):Observable<UsersLightAPI> => {
      return this.http.post<UsersLightAPI>(`${this.url}user/list-light`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    delete: (userID: string): Observable<any> => {
      return this.http.delete<any>(`${this.url}user/${userID}`).pipe(
        catchError(this.handleError)
      );
    },
    add: (userData: NewUser): Observable<any> => {
      return this.http.post<any>(`${this.url}user/create`, userData).pipe(
        catchError(this.handleError)
      );
    },
    update: (userID: string, userData: updateUser): Observable<any> => {
      return this.http.put<any>(`${this.url}user/${userID}`, userData).pipe(
        catchError(this.handleError)
      );
    }

  };


  SuppliersAPIs = {
    add: (userData: NewUser): Observable<any> => {
      return this.http.post<any>(`${this.url}supplier/create`, userData).pipe(
        catchError(this.handleError)
      );
    },
    listAccount: (searchBy: SearchSupplierAccount):Observable<any> => {
      return this.http.post<any>(`${this.url}supplier/account`, searchBy).pipe(
        catchError(this.handleError)
      );
    }
  }

  ServicesAPIs = {
    list: (searchConditions?: SearchService): Observable<ServicesAPI> => {
      console.log(searchConditions);
      return this.http.post<ServicesAPI>(`${this.url}service/list`, searchConditions).pipe(
        catchError(this.handleError)
      );
    },
    delete: (serviceID: number): Observable<any> => {
      return this.http.delete<any>(`${this.url}service/${serviceID}`).pipe(
        catchError(this.handleError)
      );
    },
    add: (service: Partial<ServicesAPI>) => {
      return this.http.post<any>(`${this.url}service/add`, service).pipe(
        catchError(this.handleError)
      );
    },
    update: (serviceID: number, service: Partial<ServicesAPI>) => {
      return this.http.put<any>(`${this.url}service/${serviceID}`, service).pipe(
        catchError(this.handleError)
      );
    }
  }

  AgentLimitsAPIs = {
    listAgents: (searchConditions: SearchAgent): Observable<any> => {
      searchConditions.role = "agent";
      return this.UsersAPIs.list(searchConditions);
    },
    add: (agentLimitsData: NewAgentLimits) => {
      return this.http.post<any>(`${this.url}agent-limits/add`, agentLimitsData).pipe(
        catchError(this.handleError)
      );
    },
    listLimits: (searchAgentLimitsData: SearchAgentLimits) => {
      return this.http.post<AgentLimitsArrayAPI>(`${this.url}agent-limits/list`, searchAgentLimitsData).pipe(
        catchError(this.handleError)
      );
    },
    delete: (id: string) => {
      return this.http.delete<any>(`${this.url}agent-limits/${id}`).pipe(
        catchError(this.handleError)
      );
    }
  }

  CarsAPIs = {
    delete: (carId: string): Observable<any> => {
      return this.http.delete<any>(`${this.url}car/${carId}`).pipe(
        catchError(this.handleError)
      );
    },
    show: (searchBy: SearchCar):Observable<CarsAPI> => {
      return this.http.post<CarsAPI>(`${this.url}car/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    add: (carData: NewCar): Observable<any> => {
      return this.http.post<any>(`${this.url}car/add`, carData).pipe(
        catchError(this.handleError)
      );
    },
    update: (carId: number, carData: updateCar): Observable<any> => {
      return this.http.put<any>(`${this.url}car/${carId}`, carData).pipe(
        catchError(this.handleError)
      );
    }
  }

  CarTypesAPIs = {
    add: (carTypeData: NewCarType): Observable<any> => {
      return this.http.post<any>(`${this.url}car-type/add`, carTypeData).pipe(
        catchError(this.handleError)
      );
    },
    list: (searchCarTypeData: SearchCarType) => {
      return this.http.post<CarTypeArrayAPI>(`${this.url}car-type/list`, searchCarTypeData).pipe(
        catchError(this.handleError)
      );
    },
    delete: (carTypeId: number): Observable<any> => {
      return this.http.delete<any>(`${this.url}car-type/${carTypeId}`).pipe(
        catchError(this.handleError)
      );
    },
    update: (carTypeId: number, carModelData: updateCarType): Observable<any> => {
      return this.http.put<any>(`${this.url}car-type/${carTypeId}`, carModelData).pipe(
        catchError(this.handleError)
      );
    }

  }

  CarModelsAPIs = {
    add: (carModelData: NewCarModel): Observable<any> => {
      return this.http.post<any>(`${this.url}car-model/add`, carModelData).pipe(
        catchError(this.handleError)
      );
    },
    list: (searchCarModelData: SearchCarModel) => {
      return this.http.post<CarModelArrayAPI>(`${this.url}car-model/list`, searchCarModelData).pipe(
        catchError(this.handleError)
      );
    },
    delete: (carModelId: number): Observable<any> => {
      return this.http.delete<any>(`${this.url}car-model/${carModelId}`).pipe(
        catchError(this.handleError)
      );
    },
    update: (carModelId: number, carModelData: updateCarModel): Observable<any> => {
      return this.http.put<any>(`${this.url}car-model/${carModelId}`, carModelData).pipe(
        catchError(this.handleError)
      );
    }
  }


  AccidentsAPIs = {
    add: (accidentData: NewAccident):Observable<any> => {
      return this.http.post<any>(`${this.url}accident/add`, accidentData).pipe(
        catchError(this.handleError)
      );
    },
    list: (searchBy: SearchAccident):Observable<AccidentsAPI> => {
      return this.http.post<AccidentsAPI>(`${this.url}accident/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    update: (accidentId: number, accidentData: NewAccident):Observable<any> => {
      return this.http.put<any>(`${this.url}accident/${accidentId}`, accidentData).pipe(
        catchError(this.handleError)
      );
    },
    delete: (accidentID: number): Observable<any> => {
      return this.http.delete<any>(`${this.url}accident/${accidentID}`).pipe(
        catchError(this.handleError)
      );
    }
  }

  InsurancePoliciesAPIs = {
    add: (insurancePolicyData: NewInsurancePolicy):Observable<any> => {
      return this.http.post<any>(`${this.url}insurance-policy/add`, insurancePolicyData).pipe(
        catchError(this.handleError)
      );
    },
    update: (insurancePolicyId: number, insurancePolicyData: updateInsurancePolicy):Observable<any> => {
      return this.http.put<any>(`${this.url}insurance-policy/${insurancePolicyId}`, insurancePolicyData).pipe(
        catchError(this.handleError)
      );
    },
    list: (searchBy: SearchInsurancePolicy):Observable<InsurancePolicesAPI> => {
      return this.http.post<InsurancePolicesAPI>(`${this.url}insurance-policy/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    delete: (insurancePolicyId: number): Observable<any> => {
      return this.http.delete<any>(`${this.url}insurance-policy/${insurancePolicyId}`).pipe(
        catchError(this.handleError)
      );
    }
  }

  OtherServicesAPIs = {
    delete: (otherServiceID: string): Observable<any> => {
      return this.http.delete<any>(`${this.url}other-service/${otherServiceID}`).pipe(
        catchError(this.handleError)
      );
    },
    show: (searchBy: SearchOtherServices):Observable<OtherServicesAPI> => {
      return this.http.post<OtherServicesAPI>(`${this.url}other-service/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    },
    add: (otherServiceData: NewOtherService): Observable<any> => {
      return this.http.post<any>(`${this.url}other-service/add`, otherServiceData).pipe(
        catchError(this.handleError)
      );
    },
    update: (otherServiceID: number, otherServiceData: updateOtherService): Observable<any> => {
      return this.http.put<any>(`${this.url}other-service/${otherServiceID}`, otherServiceData).pipe(
        catchError(this.handleError)
      );
    }
  }

  AccountsAPIs = {
    list: (searchBy: SearchAccount):Observable<AccountsAPI> => {
      return this.http.post<AccountsAPI>(`${this.url}account/list`, searchBy).pipe(
        catchError(this.handleError)
      );
    }
  }

  GeneralAPIs = {
    regionsAndRoles: () => {
      return this.http.get<any>(`${this.url}general/regions-roles`).pipe(
        catchError(this.handleError)
      )
    },
    regions: ():Observable<RegionsAPI> => {
      return this.http.get<RegionsAPI>(`${this.url}general/regions`).pipe(
        catchError(this.handleError)
      );
    },
    statistics: ():Observable<any> => {
      return this.http.get<any>(`${this.url}general/statistics`).pipe(
        catchError(this.handleError)
      );
    }
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
