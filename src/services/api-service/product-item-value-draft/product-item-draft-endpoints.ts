import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const UPDATE_PRODUCT_ITEM_ACTION_MACHINE_URL = '/v1/calculation-service/calculations/update-action-machine';
const UPDATE_PRODUCT_ITEM_ACTION_Employee_URL = '/v1/erp-service/update-product-item-action-employee';
const CHANGE_WORK_FLOW = '/v1/erp-service/product-item-value/change-work-flow';
const UPDATE_PRODUCT_ITEM_ACTION_DATA_URL = '/v1/erp-service/quote/update-product-item-draft-work-flow-data';
const UPDATE_SELECTED_WORK_FLOW_URL = '/v1/calculation-service/calculations/update-work-flow';
const UPDATE_PRODUCT_ITEM_VALUE_OUTSOURCE = '/v1/erp-service/quote/update-product-item-value-out-source';
const UPDATED_PRODUCT_ITEM_VALUE_OUTSOURCE_SUPPLIER_COST = '/v1/erp-service/quote/update-product-item-value-out-source-supplier-cost';

const UPDATED_BOARD_MISSION_ACTION_OUTPUT_URL = '/v1/erp-service/board-missions/update-board-mission-action-output';

const updateProductItemDraftActionMachine: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_ACTION_MACHINE_URL, setState , data);
}
const changeWorkFlw: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, CHANGE_WORK_FLOW, setState , data);
}
const updateProductItemDraftActionData: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_ACTION_DATA_URL, setState , data);
}
const updateSelectedWorkFlowApi: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_SELECTED_WORK_FLOW_URL, setState , data);
}
const updateProductItemValueOutsource: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_VALUE_OUTSOURCE, setState , data);
}
const updateProductItemValueOutsourceSupplierCost: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATED_PRODUCT_ITEM_VALUE_OUTSOURCE_SUPPLIER_COST, setState , data);
}

const updateActionEmployeeApi: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_PRODUCT_ITEM_ACTION_Employee_URL, setState , data);
}

const updateBoardMissionActionOutputApi: ICallAndSetData = async (callApi, setState, data:{}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATED_BOARD_MISSION_ACTION_OUTPUT_URL, setState , data);
}

export 
{ 
    changeWorkFlw, 
    updateProductItemDraftActionMachine, 
    updateProductItemDraftActionData, 
    updateSelectedWorkFlowApi, 
    updateProductItemValueOutsource, 
    updateProductItemValueOutsourceSupplierCost,
    updateActionEmployeeApi,
    updateBoardMissionActionOutputApi
 };