import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_ENUMS_URL = "/v1/enum/get-enums/";


const getCurrencies: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
      GET_ENUMS_URL + 'currency',
    setState
  );
};
const getCurrenciesSymbols : ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_ENUMS_URL + 'CurrencyUnit',
      setState
  );
};

export {
  getCurrencies,
  getCurrenciesSymbols
};
