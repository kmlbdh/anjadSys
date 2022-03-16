import { UserAPI } from "./user";
import { CarAPI } from './car';
import { ServicePolicyAPI, NewServicePolicy, updateServicePolicy } from './service';


export interface InsurancePolicyAPI {
  [index: string]: number | string | Date | undefined | UserAPI | CarAPI | ServicePolicyAPI[],
  id: number,
  totalPrice: number,
  note: string,
  ServicePolicies: ServicePolicyAPI[],
  customerId?: string,
  agentId?: string,
  carId?: number,
  Customer: UserAPI,
  Agent: UserAPI,
  Car: CarAPI,
  createdAt: Date,
  updatedAt: Date,
}

export interface updateInsurancePolicy {
  [index: string]: number | string | Date | CarAPI | UserAPI | updateServicePolicy[] | undefined,
  insurancePolicyId: number,
  totalPrice?: number,
  note?: string,
  customerId?: string,
  services: updateServicePolicy[],
  agentId?: string,
  carId?: number,
}

export interface InsurancePolicesAPI{
  data:[InsurancePolicyAPI];
  total: number;
}

export interface NewInsurancePolicy{
  [index: string]: number | string | Date | NewServicePolicy[],
  totalCost: number,
  note: string,
  services: NewServicePolicy[],
  customerId: string,
  agentId: string,
  carId: number,
}

export interface SearchInsurancePolicy {
  [index: string]: number | string | Date | undefined,
  insurancePolicyId?: number,
  customerID?: string,
  agentID?: string,
  carID?: number,
  skip?: number,
  limit?: number,
}
