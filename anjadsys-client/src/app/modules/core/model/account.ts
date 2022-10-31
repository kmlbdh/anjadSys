import { UserAPI } from './user';
import { InsurancePolicyAPI } from './insurancepolicy';
import { ServiceAccidentAPI, ServiceAPI } from './service';

export interface SupplierAccountAPI {
  ServiceAccident: ServiceAccidentAPI
  accountId: number,
  id: number,
  cost?: number,
  serviceAccidentId: number | null,
  servicePolicyId: number | null,
  Service: ServiceAPI,
  supplierPercentage: number,
  coverageDays?: number,
  additionalDays: number,
  createdAt: Date,
}

export interface SupplierAccountsAPI {
  data: [SupplierAccountAPI],
  total: number;
}

export interface AccountAPI {
  [index: string]: number | string | Date | undefined | UserAPI | InsurancePolicyAPI | SupplierAccountAPI,
  id: number,
  credit: number,
  debit: number,
  insurancePolicyId: number,
  note?: string,
  agentId: number,
  Agent: UserAPI,
  InsurancePolicy?: InsurancePolicyAPI,
  InsurancePolicy_Account: any,
  Supplier_Account?: SupplierAccountAPI,
  createdAt: Date,
  updatedAt: Date,
}

export interface NewAccount{
  [index: string]: number | string | Date | undefined,
  credit: number,
  debit: number,
  insurancePolicyId: number,
  note?: string,
  agentId: number,
}


export interface SearchAccount {
  [index: string]: number | string | Date | undefined,
  insurancePolicyId?: number,
  customerID?: number,
  agentID?: number,
  startDate?: Date,
  endDate?: Date,
  skip?: number,
  limit?: number,
}

export interface AccountsAPI{
  data:[AccountAPI],
  total: number,
  agentBalance: number,
}

