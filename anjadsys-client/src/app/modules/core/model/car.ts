import { UserAPI } from './user';

export interface CarAPI {
  [index: string]: number | string | Date | undefined | UserAPI | CarModelAPI | CarTypeAPI,
  id: number,
  carNumber: string,
  motorNumber: string,
  motorPH: number,
  licenseType: string,
  serialNumber: string,
  passengersCount: number,
  productionYear: Date,
  note: string,
  customerId?: number,
  carModelId?: number,
  carTypeId?: number,
  User: UserAPI,
  CarType: CarTypeAPI,
  CarModel: CarModelAPI,
  createdAt: Date,
  updatedAt: Date,
}

export interface updateCar {
  [index: string]: number | string | Date | undefined,
  carId: number,
  carNumber: string,
  motorNumber: string,
  motorPH: number,
  licenseType: string,
  serialNumber: string,
  passengersCount: number,
  productionYear: Date,
  note?: string,
  customerId: number,
  carModelId: number,
  carTypeId: number,
}

export interface CarTypeAPI {
  [index: string]: number | string,
  id: number,
  name: string,
}

export interface CarModelAPI {
  [index: string]: number | CarTypeAPI | string | undefined,
  id: number,
  name: string,
  carTypeId?: number,
  CarType: CarTypeAPI,
}

export interface updateCarModel {
  [index: string]: number | string,
  carModelId: number,
  name: string,
  carTypeId: number,
}

export interface SearchCar {
  limit?: number,
  skip?: number,
  carId?: number,
  carNumber?: string,
  customerID?: string,
  serialNumber?: string,
  motorNumber?: string,
}

export interface CarsAPI{
  data:[CarAPI];
}

export interface NewCar{ //CreateCarData
  carNumber: string,
  motorNumber: string,
  motorPH: number,
  licenseType: string,
  serialNumber: string,
  passengersCount: number,
  productionYear: Date,
  note?: string,
  customerId: number,
  carModelId: number,
  carTypeId: number,
}

export interface NewCarType{
  name: string,
}

export interface SearchCarType {
  name?: string;
  carTypeId?: number,
}

export interface updateCarType {
  [index: string]: number | string,
  carTypeId: number,
  name: string,
}

export interface CarTypeArrayAPI{
  data: [CarTypeAPI]
}

export interface NewCarModel{
  name: string,
  carTypeId: number,
}

export interface SearchCarModel {
  carModelId?: number,
  name?: string;
  cartypeId?: number
}

export interface CarModelArrayAPI{
  data: [CarModelAPI]
}
