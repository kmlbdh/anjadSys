import { AccidentAPI } from './accident';
import { UserAPI } from './user';
export interface SearchService {
  serviceName?: string;
  serviceID?: string;
}

export interface ServiceAPI {
  [index: string]: string | number | Date | boolean | PropertiesUI | undefined;
  id: number;
  name: string;
  coverageDays: number;
  cost: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  propertiesUI?: PropertiesUI
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
  propertiesUI?: PropertiesUI
}

export interface ServicesAPI {
  data: [ServiceAPI];
}

/* ########################### SERVICE ACCIDENT ############################### */
export interface ServiceAccidentAPI {
  [index: string]: string | number | AccidentAPI | ServiceAPI | UserAPI | undefined;
  id: number,
  cost: number,
  additionalDays: number,
  note: string,
  accidentId?: number,
  serviceId?: number,
  supplierId?: string,
  Accident: AccidentAPI,
  Service: ServiceAPI,
  Supplier: UserAPI
}
export interface NewServiceAccident {
  [index: string]: string | number | undefined;
  cost: number,
  additionalDays: number,
  note?: string,
  accidentId?: number,
  serviceId: number,
  supplierId: string,
}
