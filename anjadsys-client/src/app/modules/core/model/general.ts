export interface UserLoggedInAPI{
  id: string,
  username: string;
  nickname: string;
  role: string;
  accessToken: string;
}
export interface RegionAPI{
  id: string,
  name: string,
}

export interface RegionsAPI{
  data: [RegionAPI]
}

export interface RoleAPI{
  id: string,
  name: string,
}
