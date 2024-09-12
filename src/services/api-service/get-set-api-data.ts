import {ICallApi, ICallBack} from "@/services/api-service/interface";
import {EHttpMethod} from "@/services/api-service/enums";
import get from "lodash.get";


const getSetApiData = async (callApi: ICallApi, method: EHttpMethod, url: string , callBackFunction: ICallBack = () =>{}, data?: any, lock: boolean = true, abort?: AbortController): Promise<{ success: boolean, data: any }> => {
    const result: any = await callApi(method, url, data, lock, abort);
    const dataKey = "data.data.data";
    const errorsDataKey = "errors";

    const _data = get(result, dataKey);
    const _errors_data = get(result, errorsDataKey);

    const res = {success: !!result.success, data: result.success ? _data : _errors_data};
    callBackFunction(res);
    return res;
};

export {getSetApiData};
