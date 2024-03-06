import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";


const GET_STATUSES_URL = '/v1/enum/get-enums/productionStatuses';
const GET_CURRENCIES_URL = '/v1/enum/get-enums/currency';

const getProductionStatusesApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_STATUSES_URL, setState);
};

const getCurrenciesApi : ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_CURRENCIES_URL, setState);
};




export {getProductionStatusesApi, getCurrenciesApi};