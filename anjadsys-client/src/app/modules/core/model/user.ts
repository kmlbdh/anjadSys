export interface UserAPI{
  [index: string]: number | string | Date | {} | undefined;
  id: string;
  identityNum: number,
  username: string;
  companyName?: string;
  jawwal1: number;
  jawwal2?: number;
  address: string;
  Region: {
    id: string,
    name: string
  };
  Role: {
    id: string,
    name: string
  },
  Agent?: UserAPI,
  tel?: number;
  fax?: number;
  email?: string;
  note?: string;
  blocked: boolean;
  servicesPackage?: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface UsersAPI{
  data:[UserAPI];
  total: number;
}

export interface UserLightAPI{
  [index: string]: string;
  id: string;
  username: string;
}

export interface UsersLightAPI{
  data:[UserLightAPI];
  total: number;
}

export interface NewUser{ //CreateUserData
    identityNum: number,
    username: string;
    companyName?: string;
    password?: string;
    confirmPassword?: string;
    roleId: number;
    regionId: number;
    jawwal1: number;
    jawwal2?: number;
    tel?: number;
    fax?: number;
    email?: number;
    address?: string;
    note?: string;
    agentId?: string;
    blocked: boolean;
    servicesPackage?: number;
}

export interface updateUser{
  [index: string]: number | string | boolean | undefined | null;
  id: string,
  identityNum: number,
  username: string;
  companyName?: string;
  password?: string;
  confirmPassword?: string;
  roleId: number;
  regionId: number;
  jawwal1: number;
  jawwal2?: number;
  tel?: number;
  fax?: number;
  email?: number;
  address?: string;
  note?: string;
  agentId?: string | null;
  blocked: boolean;
  servicesPackage?: number;
}

export interface SearchUser {
  [index: string]: number | string | boolean | undefined | null;
  skip?: number;
  limit?: number;
  userID?: string;
  identityNum?: number,
  role?: string;
  agentID?: string;
  companyName?: string;
  username?: string;
  agent?: boolean;
  regionID?: number;
  skipLoadingInterceptor?: boolean;
}
