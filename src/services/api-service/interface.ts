export type ICallApi = (
    method: string,
    url: string,
    data?: any,
    lock?: boolean
) => any;
export type ICallBack = (res: {success: boolean, data: any}) => void

export interface ApiResponse {
    success: boolean,
    data: any
}
export type ICallAndSetData = (callApi: ICallApi, callBack: ICallBack, data?: any ) => Promise<ApiResponse>;
