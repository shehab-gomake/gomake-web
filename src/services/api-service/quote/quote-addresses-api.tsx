import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const UPDATE_CLIENT_ADDRESS_URL = '/v1/erp-service/quote/update-quote-address';
const ADD_CLIENT_ADDRESS_URL = '/v1/erp-service/quote/add-quote-address';
const DELETE_CLIENT_ADDRESS_URL = '/v1/erp-service/quote/delete-quote-address';


const updateQuoteAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_CLIENT_ADDRESS_URL, setState, data);
}

const addQuoteAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_CLIENT_ADDRESS_URL, setState, data);
}

const deleteQuoteAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, DELETE_CLIENT_ADDRESS_URL, setState, data);
}


export { updateQuoteAddressApi , addQuoteAddressApi , deleteQuoteAddressApi };