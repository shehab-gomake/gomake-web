export type ICallApi = (
    method: string,
    url: string,
    data?: any,
    lock?: boolean
) => any;
export type ISetState = (data: any) => void

export interface ApiResponse {
    success: boolean,
    data: any
}
export type ICallAndSetData = (callApi: ICallApi, setState: ISetState, data?: any ) => Promise<ApiResponse>;
