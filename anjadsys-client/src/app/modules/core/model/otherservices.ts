import { UserAPI } from './user';
import { InsurancePolicyAPI } from './insurancepolicy';
export interface SearchOtherServices {
  [index: string]: string | number | Date | boolean | UserAPI | undefined;
  otherServiceName?: string;
  otherServiceID?: number;
  customerID?: string,
  startDate?: Date,
  endDate?: Date,
  skip?: number,
  limit?: number,
  Customer?: UserAPI,
}

export interface OtherServiceAPI {
  [index: string]: string | number | Date | boolean | UserAPI | InsurancePolicyAPI | undefined;
  id: number,
  name: string,
  serviceKind: string,
  fileStatus: string,
  descCustomer: string,
  description: string,
  cost: number,
  createdAt: Date,
  updatedAt: Date,
  customerId: string,
  insurancePolicyId: number,
  Customer: UserAPI,
  InsurancePolicy: InsurancePolicyAPI
}

export interface NewOtherService{
  name: string,
  serviceKind: string,
  fileStatus: string,
  descCustomer: string,
  description: string,
  customerId: number,
  cost: number,
  insurancePolicyId: number,
}

export interface updateOtherService {
  [index: string]: number | string | undefined,
  otherServiceID: number,
  name: string,
  serviceKind: string,
  fileStatus: string,
  descCustomer: string,
  description: string,
  customerId: number,
  cost: number,
  insurancePolicyId: number,
}

export interface OtherServicesAPI {
  data: [OtherServiceAPI];
  total: number;
}
