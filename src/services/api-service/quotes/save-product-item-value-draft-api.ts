import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const SAVE_PRODUCT_ITEM_VALUE_URL = '/v1/erp-service/quote/save-product-item-draft';

const saveProductItemValueDraft: ICallAndSetData = async (callApi, setState, data: {isAgent: boolean}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SAVE_PRODUCT_ITEM_VALUE_URL, setState , data);
}
export { saveProductItemValueDraft };