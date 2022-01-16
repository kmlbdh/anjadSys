export interface NewPart{
  partNo?: number;
  partName: string;
  quantity: number;
  cost: number;
  supplierID: string;
}

export interface partAPI {
  _id: string;
  partNo: number;
  partName: string;
  quantity: number;
  cost: number;
  supplierID: string;
  created_at: Date;
  updated_at: Date;
}
