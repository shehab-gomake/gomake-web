import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_ENUMS_URL = "/v1/enum/get-enums/";


const getCurrencies: ICallAndSetData<any, any> = async (callApi, setState) => {
  return await getSetApiData<any>(
    callApi,
    EHttpMethod.GET,
      GET_ENUMS_URL + 'currency',
    setState
  );
};


export {
  getCurrencies
};
