export type ICallApi = (
    method: string,
    url: string,
    data?: any,
    lock?: boolean,
) => any;
export type ICallBack<T> = (res: {success: boolean, data: T}) => void

export interface ApiResponse<T> {
    success: boolean,
    data: T
}
export type ICallAndSetData<T,K> = (callApi: ICallApi, callBack: ICallBack<T>, data?: K, lock?: boolean ) => Promise<ApiResponse<T>>;
