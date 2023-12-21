import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const GET_CLIENT_TYPES_URL = '/v1/crm-service/clients/get-all-client-types';

const getAndSetClientTypes: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_CLIENT_TYPES_URL, setState); 
}

export {getAndSetClientTypes};