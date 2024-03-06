import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
const GET_CLIENT_TYPES_URL = '/v1/crm-service/clients/get-all-client-types';
const ADD_CLIENT_TYPE_URL = '/v1/crm-service/clients/add-client-type';
const DELETE_CLIENT_TYPE_URL = '/v1/crm-service/clients/delete-client-type';

const getAndSetClientTypes: ICallAndSetData = async (callApi, setState , data) => {
  return await getSetApiData(callApi, EHttpMethod.GET, GET_CLIENT_TYPES_URL, setState , data); 
}

const addClientTypeApi: ICallAndSetData = async (callApi, setState , clientType : {
  name: string,
  cardType : CLIENT_TYPE_Id
}) => {
  return await getSetApiData(callApi, EHttpMethod.POST, ADD_CLIENT_TYPE_URL, setState , clientType); 
}

const deleteClientTypeApi: ICallAndSetData = async (callApi, setState , id: string) => {
  return await getSetApiData(callApi, EHttpMethod.POST, DELETE_CLIENT_TYPE_URL, setState , id); 
}

export {getAndSetClientTypes ,addClientTypeApi, deleteClientTypeApi}; 