export interface UserAPI{
  [index: string]: number | string | Date | {} | null;
  id: string;
  identityNum: number,
  username: string;
  companyName: string | null;
  jawwal1: number;
  jawwal2: number | null;
  address: string;
  Region: {
    id: string,
    name: string
  };
  Role: {
    id: string,
    name: string
  },
  Agent: UserAPI | null,
  tel: number | null;
  fax: number | null;
  email: string | null,
  note: string | null;
  blocked: boolean;
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
    agentId?: string,
    blocked: boolean;
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
}

export interface SearchUser {
  skip?:number;
  limit?: number;
  userID?: string;
  role?: string;
  agentID?: string;
  companyName?: string;
  username?: string;
  agent?: boolean;
  regionID?: number;
  skipLoadingInterceptor?: boolean;
}
