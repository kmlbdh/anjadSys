import { UserAPI } from './user';
import { CarAPI } from './car';
import { RegionAPI } from './general';
import { ServiceAccidentAPI, NewServiceAccident } from './service';

export interface AccidentAPI {
  [index: string]: number | string | Date | undefined | CarAPI | UserAPI | RegionAPI | ServiceAccidentAPI[],
  id: number,
  name: string,
  accidentPlace: string,
  accidentDate: Date,
  registerAccidentDate: Date,
  driverName: string,
  driverIdentity: number,
  accidentDescription: string,
  expectedCost: number,
  note?: string,
  Customer: UserAPI,
  Car: CarAPI,
  Agent: UserAPI,
  Region: RegionAPI,
  regionId?: number,
  csutomerId?: number,
  agentId?: number,
  carId?: number,
  services?: ServiceAccidentAPI[]
}

export interface NewAccident{
  [index: string]: number | string | Date | undefined | NewServiceAccident[],
  name: string,
  accidentPlace: string,
  accidentDate: Date,
  registerAccidentDate: Date,
  driverName: string,
  driverIdentity: number,
  accidentDescription: string,
  expectedCost: number,
  note?: string,
  regionId: number,
  csutomerId: number,
  agentId: number,
  carId: number,
  services: NewServiceAccident[]
}


export interface SearchAccident {
  [index: string]: number | string | Date | undefined,
  accidentId?: number,
  accidentPlace?: string,
  accidentDate?: Date,
  registerAccidentDate?: Date,
  driverName?: string,
  driverIdentity?: number,
  regionId?: number,
  csutomerId?: number,
  agentId?: number,
  carId?: number,
}

export interface AccidentsAPI{
  data:[AccidentAPI];
}

