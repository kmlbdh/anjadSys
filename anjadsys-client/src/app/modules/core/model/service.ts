export interface SearchService {
  serviceName?: string;
  serviceID?: string;
}

export interface ServiceAPI {
  [index: string]: string | number | Date;
  _id: string;
  name: string;
  coverDays: number;
  cost: number;
  note: string;
  dailyCost: number;
  created_at: Date;
  updated_at: Date;
}

export interface ServicesAPI {
  data: [ServiceAPI];
}
