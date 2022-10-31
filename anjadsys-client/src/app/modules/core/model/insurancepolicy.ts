import { UserAPI } from './user';
import { CarAPI } from './car';
import { ServicePolicyAPI, NewServicePolicy, updateServicePolicy } from './service';
import { EndorsementAPI } from './endorsement';


export interface InsurancePolicyAPI {
  [index: string]: number | string | Date | undefined | UserAPI | CarAPI | ServicePolicyAPI[] | EndorsementAPI[],
  id: number,
  totalPrice: number,
  expireDate: Date,
  note: string,
  ServicePolicies: ServicePolicyAPI[],
  customerId?: string,
  agentId?: string,
  carId?: number,
  Customer: UserAPI,
  Agent: UserAPI,
  Car: CarAPI,
  Endorsements: EndorsementAPI[],
  createdAt: Date,
  updatedAt: Date,
}

export interface updateInsurancePolicy {
  [index: string]: number | string | Date | CarAPI | UserAPI | updateServicePolicy[] | undefined,
  insurancePolicyId: number,
  totalPrice?: number,
  expireDate?: Date,
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
  expireDate: Date,
  note: string,
  services: NewServicePolicy[],
  customerId: string,
  agentId: string,
  carId: number,
}

export interface SearchInsurancePolicy {
  [index: string]: number | string | Date | boolean | undefined,
  insurancePolicyId?: number,
  customerID?: string,
  agentID?: string,
  carID?: number,
  filterOutValid?: boolean,
  skip?: number,
  limit?: number,
}
