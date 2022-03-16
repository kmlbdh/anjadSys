import { UserAPI } from './user';
import { InsurancePolicyAPI } from './insurancepolicy';
import { ServiceAccidentAPI } from './service';

export interface SupplierAccountAPI {
  ServiceAccident: ServiceAccidentAPI
  accountId: number,
  id: number,
  serviceAccidentId: number | null,
  servicePolicyId: number | null,
  supplierPercentage: number,
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
  skip?: number,
  limit?: number,
}

export interface AccountsAPI{
  data:[AccountAPI];
  total: number;
}

