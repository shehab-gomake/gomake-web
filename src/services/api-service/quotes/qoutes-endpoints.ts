import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const ADD_ITEM_TO_QUOTE_URL = '/v1/erp-service/quote/add-item';

const addItemToQuoteApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_ITEM_TO_QUOTE_URL, setState, data);
}




export {addItemToQuoteApi}
