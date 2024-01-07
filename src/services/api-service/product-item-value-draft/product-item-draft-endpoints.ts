import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const UPDATE_PRODUCT_ITEM_ACTION_MACHINE_URL = '/v1/erp-service/quote/update-product-item-draft-action-machine';
const UPDATE_PRODUCT_ITEM_ACTION_DATA_URL = '/v1/erp-service/quote/update-product-item-draft-work-flow-data';
const UPDATE_SELECTED_WORK_FLOW_URL = '/v1/erp-service/quote/update-selected-work-flow';


const updateProductItemDraftActionMachine: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_ACTION_MACHINE_URL, setState , data);
}
const updateProductItemDraftActionData: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_ACTION_DATA_URL, setState , data);
}
const updateSelectedWorkFlowApi: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_SELECTED_WORK_FLOW_URL, setState , data);
}
export { updateProductItemDraftActionMachine, updateProductItemDraftActionData, updateSelectedWorkFlowApi };