export type ICallApi = (
  method: string,
  url: string,
  data?: any,
  lock?: boolean
) => any;
export type ISetState = (data: any) => any;
