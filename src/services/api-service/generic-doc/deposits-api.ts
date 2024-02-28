import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_ALL_DEPOSITS_URL = "/v1/erp-service/deposits/get-all-deposits";

const getAllDepositsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_DEPOSITS_URL,
    setState,
    data
  );
};



export {
    getAllDepositsApi,
};
