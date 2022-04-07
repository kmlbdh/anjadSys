import { UserAPI } from './user';
export interface SearchService {
  serviceName?: string;
  serviceID?: string;
  skip?: number,
  limit?: number,
}

export interface ServiceAPI {
  [index: string]: string | number | Date | boolean | PropertiesUI | undefined;
  id: number;
  name: string;
  coverageDays: number;
  cost: number;
  supplierPercentage: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  propertiesUI?: PropertiesUI;
}

interface PropertiesUI {
  [index: string]: string | number | Date | boolean | undefined;
  hide?: boolean;
  totalDays?: number;
  serviceName?: string;
  totalCost?: number;
}

export interface NewService {
  [index: string]: string | number | Date | PropertiesUI | undefined;
  name: string;
  coverageDays: number;
  cost: number;
  note: string;
  supplierPercentage: number;
  propertiesUI?: PropertiesUI;
}

export interface ServicesAPI {
  data: [ServiceAPI];
  total: number;
}

/* ########################### SERVICE ACCIDENT ############################### */
export interface ServiceAccidentAPI {
  [index: string]: string | number | ServiceAPI | UserAPI | undefined;
  id: number,
  coverageDays: number,
  note: string,
  accidentId?: number,
  serviceId?: number,
  supplierId?: string,
  // Accident: AccidentAPI,
  Service: ServiceAPI,
  Supplier: UserAPI
}
export interface NewServiceAccident {
  [index: string]: string | number | any | undefined;
  coverageDays: number,
  note?: string,
  accidentId?: number,
  serviceId: number,
  supplierId: string,
}

/* ########################### SERVICE POLICY ############################### */
export interface ServicePolicyAPI {
  [index: string]: string | number | Date | ServiceAPI | UserAPI | PropertiesUI | undefined ;
  id: number,
  cost: number,
  additionalDays: number,
  note?: string,
  insurancePolicyId?: number,
  serviceId?: number,
  supplierId?: string,
  supplierPercentage: number,
  Service: ServiceAPI,
  Supplier: UserAPI,
  createdAt: Date,
  updatedAt: Date,
  propertiesUI?: PropertiesUI;
}

export interface NewServicePolicy {
  [index: string]: string | number | undefined;
  cost: number,
  additionalDays: number,
  supplierPercentage: number,
  note?: string,
  serviceId: number,
  supplierId: string,
}
// insurancePolicyId?: number,

export interface updateServicePolicy {
  [index: string]: string | number | undefined;
  id?: number,
  cost: number,
  additionalDays: number,
  supplierPercentage: number,
  note?: string,
  serviceId: number,
  supplierId: string,
}
