export interface UserAPI{
  [index: string]: number | string | Date;
  _id: string;
  username: string;
  nickname: string;
  role: string;
  phone: number;
  address: string;
  tel: number;
  note: any;
  created_at: Date;
  updated_at: Date;
}
export interface UsersAPI{
  data:[UserAPI];
}

export interface NewUser{ //CreateUserData
    username: string;
    nickname?: string;
    password: string;
    confirmPassword: string;
    role: string;
    phone?: number;
    tel?: number;
    address?: string;
    note?: string;
}

export interface updateUser{ //updateUser
  username?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
  phone?: number;
  tel?: number;
  address?: string;
  note?: string;
}

export interface SearchUser {
  skip?:number;
  limit?: number;
  userID?: string;
  role?: string;
  agentID?: string;
  nickname?: string;
}
