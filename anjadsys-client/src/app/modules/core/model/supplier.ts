export interface SupplierAPI{
  username: string;
  nickname: string;
  address: string;
  tel: number;
  phone: number;
  role: string;
}

export interface SearchSuppliers{
  role?: string;
  limit?: number;
  skip?: number;
  agentID?: string;
  userID?: string;
  nickname?: string;
  username?: string;
}

export interface SearchSupplierAccount{
  flag: string,
  supplierID: string,
  startDate?: Date,
  endDate?: Date,
  limit?: number;
  skip?: number;
}

