import {ICallApi, ICallBack} from "@/services/api-service/interface";
import {EHttpMethod} from "@/services/api-service/enums";
import get from "lodash.get";


const getSetApiData = async <T>(callApi: ICallApi, method: EHttpMethod, url: string , callBackFunction: ICallBack = () =>{}, data?: any, lock: boolean = true): Promise<{ success: boolean, data: T }> => {
    const result: any = await callApi(method, url, data, lock);
    const dataKey = "data.data.data";
    const _data = get(result, dataKey);
    const res = {success: !!result.success, data: _data};
    callBackFunction(res);
    return res;
};

export {getSetApiData};
