interface ChildNav{
  id: number,
  name: string,
  link: string
}

export interface NavInput{
  id: number,
  name: string,
  faIcon: any,
  hide: boolean,
  children: ChildNav[]
}
