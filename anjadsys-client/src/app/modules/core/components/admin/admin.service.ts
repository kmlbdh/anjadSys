import { updateInsurancePolicy } from './../../model/insurancepolicy';
import { updateCar, updateCarModel, updateCarType } from './../../model/car';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AgentLimitsArrayAPI, NewAgentLimits, SearchAgentLimits } from '../../model/agentlimits';
import { NewPart } from '../../model/supplierparts';
import { SearchUser, UsersAPI, NewUser, updateUser, UsersLightAPI } from '../../model/user';
import { SearchSuppliers, SearchSupplierAccount } from '../../model/supplier';
import { SearchService, ServicesAPI } from '../../model/service';
import { SearchAgent } from '../../model/agent';
import { CarsAPI, NewCar, SearchCar, NewCarType, NewCarModel, SearchCarType, CarTypeArrayAPI, SearchCarModel, CarModelArrayAPI } from '../../model/car';
import { SearchAccident, AccidentsAPI, NewAccident } from '../../model/accident';
import { RegionsAPI } from '../../model/general';
import { NewInsurancePolicy, SearchInsurancePolicy, InsurancePolicesAPI } from '../../model/insurancepolicy';
import { AccountsAPI, SearchAccount } from '../../model/account';

@Injectable()
export class AdminService {
  private url = "http://localhost:4200/api/admin/";
  // private url = "https://injad.albayraq.net/api/admin/";

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

  listLightUsers(searchBy: SearchUser):Observable<UsersLightAPI>{
    return this.http.post<UsersLightAPI>(`${this.url}list-light-users`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<any>{
    return this.http.post<any>(`${this.url}delete-user`, {username: id}).pipe(
      catchError(this.handleError)
    );
  }

  addUser(userData: NewUser): Observable<any>{
    return this.http.post<any>(`${this.url}create-user`, userData).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(userData: updateUser): Observable<any>{
    return this.http.post<any>(`${this.url}edit-user`, userData).pipe(
      catchError(this.handleError)
    );
  }

  addSupplier(userData: NewUser): Observable<any>{
    return this.http.post<any>(`${this.url}create-supplier`, userData).pipe(
      catchError(this.handleError)
    );
  }

  listSuppliers(searchConditions: SearchSuppliers): Observable<any>{
    searchConditions.role = "supplier";
    return this.http.post<any>(`${this.url}list-users`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  listServices(searchConditions?: SearchService): Observable<ServicesAPI>{
    return this.http.post<ServicesAPI>(`${this.url}list-services`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  addSupplierParts(supplierPartsData: NewPart){
    return this.http.post<any>(`${this.url}add-supplier-part`, supplierPartsData).pipe(
      catchError(this.handleError)
    );
  }

  listSupplierParts(searchConditions: {supplierID: string}): Observable<any>{
    return this.http.post<any>(`${this.url}list-supplier-parts`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  deleteSupplierPart(id: string): Observable<any>{
    return this.http.post<any>(`${this.url}delete-supplier-part`, {supplierPartsID: id}).pipe(
      catchError(this.handleError)
    );
  }

  listAgents(searchConditions: SearchAgent): Observable<any>{
    searchConditions.role = "agent";
    return this.http.post<any>(`${this.url}list-users`, searchConditions).pipe(
      catchError(this.handleError)
    );
  }

  addAgentLimits(agentLimitsData: NewAgentLimits){
    return this.http.post<any>(`${this.url}add-agent-limits`, agentLimitsData).pipe(
      catchError(this.handleError)
    );
  }

  listAgentLimits(searchAgentLimitsData: SearchAgentLimits){
    return this.http.post<AgentLimitsArrayAPI>(`${this.url}list-agent-limits`, searchAgentLimitsData).pipe(
      catchError(this.handleError)
    );
  }

  deleteAgentLimits(id: string){
    return this.http.post<any>(`${this.url}delete-agent-limits`, {agentLimitID: id}).pipe(
      catchError(this.handleError)
    );
  }

  deleteService(id: number): Observable<any>{
    return this.http.post<any>(`${this.url}delete-service`, {serviceID: id}).pipe(
      catchError(this.handleError)
    );
  }

  addService(service: Partial<ServicesAPI>){
    return this.http.post<any>(`${this.url}add-service`, service).pipe(
      catchError(this.handleError)
    );
  }

  updateService(service: Partial<ServicesAPI>){
    return this.http.post<any>(`${this.url}update-service`, service).pipe(
      catchError(this.handleError)
    );
  }

  getRegionsAndRoles(){
    return this.http.get<any>(`${this.url}get-regions-roles`).pipe(
      catchError(this.handleError)
    )
  }

  deleteCar(id: string): Observable<any>{
    return this.http.post<any>(`${this.url}delete-car`, {carId: id}).pipe(
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

  updateCar(carData: updateCar): Observable<any>{
    return this.http.post<any>(`${this.url}edit-car`, carData).pipe(
      catchError(this.handleError)
    );
  }

  addCarType(carTypeData: NewCarType): Observable<any>{
    return this.http.post<any>(`${this.url}add-car-type`, carTypeData).pipe(
      catchError(this.handleError)
    );
  }

  listCarTypes(searchCarTypeData: SearchCarType){
    return this.http.post<CarTypeArrayAPI>(`${this.url}list-car-types`, searchCarTypeData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCarType(id: number): Observable<any>{
    return this.http.post<any>(`${this.url}delete-car-type`, {carTypeId: id}).pipe(
      catchError(this.handleError)
    );
  }

  updateCarType(carModelData: updateCarType): Observable<any>{
    return this.http.post<any>(`${this.url}edit-car-type`, carModelData).pipe(
      catchError(this.handleError)
    );
  }

  addCarModel(carModelData: NewCarModel): Observable<any>{
    return this.http.post<any>(`${this.url}add-car-model`, carModelData).pipe(
      catchError(this.handleError)
    );
  }

  listCarModels(searchCarModelData: SearchCarModel){
    return this.http.post<CarModelArrayAPI>(`${this.url}list-car-models`, searchCarModelData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCarModel(id: number): Observable<any>{
    return this.http.post<any>(`${this.url}delete-car-model`, {carModelId: id}).pipe(
      catchError(this.handleError)
    );
  }

  updateCarModel(carModelData: updateCarModel): Observable<any>{
    return this.http.post<any>(`${this.url}edit-car-model`, carModelData).pipe(
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

  deleteAccident(id: number): Observable<any>{
    return this.http.post<any>(`${this.url}delete-accident`, {accidentID: id}).pipe(
      catchError(this.handleError)
    );
  }

  listRegions():Observable<RegionsAPI>{
    return this.http.get<RegionsAPI>(`${this.url}list-regions`).pipe(
      catchError(this.handleError)
    );
  }

  addInsurancePolicy(insurancePolicyData: NewInsurancePolicy):Observable<any>{
    return this.http.post<any>(`${this.url}add-insurance-policy`, insurancePolicyData).pipe(
      catchError(this.handleError)
    );
  }

  updateInsurancePolicy(insurancePolicyData: updateInsurancePolicy):Observable<any>{
    return this.http.post<any>(`${this.url}edit-insurance-policy`, insurancePolicyData).pipe(
      catchError(this.handleError)
    );
  }

  listInsurancePolicy(searchBy: SearchInsurancePolicy):Observable<InsurancePolicesAPI>{
    return this.http.post<InsurancePolicesAPI>(`${this.url}list-insurance-policy`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  deleteInsurancePolicy(id: number): Observable<any>{
    return this.http.post<any>(`${this.url}delete-insurance-policy`, {insurancePolicyId: id}).pipe(
      catchError(this.handleError)
    );
  }

  listAccounts(searchBy: SearchAccount):Observable<AccountsAPI>{
    return this.http.post<AccountsAPI>(`${this.url}list-accounts`, searchBy).pipe(
      catchError(this.handleError)
    );
  }

  statisticsForMainPage():Observable<any>{
    return this.http.get<any>(`${this.url}statistics`).pipe(
      catchError(this.handleError)
    );
  }

  listSupplierAccount(searchBy: SearchSupplierAccount):Observable<any>{
    return this.http.post<any>(`${this.url}supplier-account`, searchBy).pipe(
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
