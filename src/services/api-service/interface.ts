export type ICallApi = (
    method: string,
    url: string,
    data?: any,
    lock?: boolean
) => any;
export type ISetState = (data: any) => void

export type ICallAndSetData = (callApi: ICallApi, setState: ISetState, data?: any ) => Promise<any>;
