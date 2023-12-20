import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const ADD_CLIENT_ADDRESS_URL = '/v1/crm-service/customer/create-address';

const addClientAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_CLIENT_ADDRESS_URL, setState, data);
}

export { addClientAddressApi };