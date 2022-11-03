import { UserAPI } from './user';
import { CarAPI } from './car';
import { InsurancePolicyAPI } from './insurancepolicy';


export interface EndorsementAPI {
  [index: string]: number | string | Date | undefined | UserAPI | CarAPI | InsurancePolicyAPI,
  id: number,
  totalPrice?: number,
  expireDate?: Date,
  note: string,
  endorsementType: number,
  carId?: number,
  insurancePolicyId?: number,
  Car: CarAPI,
  InsurancePolicy: InsurancePolicyAPI,
  createdAt: Date,
  updatedAt: Date,
}

export interface updateEndorsement {
  [index: string]: number | string | Date | CarAPI | UserAPI | undefined,
  endorsementId: number,
  endorsementType?: number,
  insurancePolicyId?: number,
  totalPrice?: number,
  expireDate?: Date,
  note?: string,
  carId?: number,
}

export interface EndorsementsAPI{
  data:[EndorsementAPI];
  total: number;
}

export interface NewEndorsement{
  [index: string]: number | string | Date,
  totalCost: number,
  expireDate: Date,
  note: string,
  endorsementType: number,
  insurancePolicyId: number,
  carId: number,
}

export interface SearchEndorsement {
  [index: string]: number | string | Date | undefined,
  insurancePolicyId?: number,
  endorsementType?: number,
  customerID?: string,
  carID?: number,
  skip?: number,
  limit?: number,
}
