export interface SearchService {
  serviceName?: string;
  serviceID?: string;
}

export interface ServiceAPI {
  [index: string]: string | number | Date;
  id: number;
  name: string;
  coverageDays: number;
  cost: number;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServicesAPI {
  data: [ServiceAPI];
}
