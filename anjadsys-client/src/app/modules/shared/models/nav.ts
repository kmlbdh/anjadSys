export interface ChildNav{
  id: number,
  name: string,
  shortName: string,
  link: string
}

export interface NavInput{
  id: number,
  name: string,
  faIcon: any,
  hide: boolean,
  children: ChildNav[]
}
