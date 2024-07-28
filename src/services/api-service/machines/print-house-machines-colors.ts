import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_MATERIAL_CATEGORIES = '/v1/materials-machines';
const GET_ALL_MACHINES = '/v1/erp-service/board-missions/get-all-machines';

const getPrintHouseMachineMaterialCategories: ICallAndSetData = async (callApi, setState, materialType) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, `${GET_MATERIAL_CATEGORIES}?materialType=${materialType}`, setState);
};

const getALLMachinesApi: ICallAndSetData = async (callApi, setState, materialType) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, `${GET_ALL_MACHINES}`, setState);
};




export {getPrintHouseMachineMaterialCategories,getALLMachinesApi};