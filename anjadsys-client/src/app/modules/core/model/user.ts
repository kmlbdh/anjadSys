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
  Agent: {
    id: string,
    name: string
  } | null,
  tel: number | null;
  fax: number | null;
  email: string | null,
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface UsersAPI{
  data:[UserAPI];
}

export interface NewUser{ //CreateUserData
    identityNum: number,
    username: string;
    companyName?: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    regionId: number;
    jawwal1: number;
    jawwal2?: number;
    tel?: number;
    fax?: number;
    email?: number;
    address?: string;
    note?: string;
    agentId?: number,
}

export interface updateUser{ //updateUser
  [index: string]: number | string | undefined;
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
  agentId?: number,
}

export interface SearchUser {
  skip?:number;
  limit?: number;
  userID?: string;
  role?: string;
  agentID?: string;
  companyName?: string;
}
