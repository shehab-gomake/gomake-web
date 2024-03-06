import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
const QUICK_SETUP_GET_MATERIALS_ROUTE = "/v1/materials/quick-setup/get-materials";
const QUICK_SETUP_SAVE_MATERIALS_ROUTE = "/v1/materials/quick-setup/save-material-categories";
const QUICK_SETUP_SAVE_MATERIALS_PRICING_ROUTE = "/v1/materials/quick-setup/update-materials-pricing";
const QUICK_SETUP_GET_MATERIALS_PRICING_ROUTE = "/v1/materials/quick-setup/get-materials-pricing";

const quickSetupGetMaterials: ICallAndSetData = async (
    callApi,
    setState,
) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.GET,
        `${QUICK_SETUP_GET_MATERIALS_ROUTE}`,
        setState
    );
};
const quickSetupSaveMaterialCategories: ICallAndSetData = async (
    callApi,
    setState,
    data
) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.POST,
        `${QUICK_SETUP_SAVE_MATERIALS_ROUTE}`,
        setState,
        data
    );
};
const quickSetupSaveMaterialsPricing: ICallAndSetData = async (
    callApi,
    setState,
    data
) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.POST,
        `${QUICK_SETUP_SAVE_MATERIALS_PRICING_ROUTE}`,
        setState,
        data
    );
};
const quickSetupGetMaterialsPricing: ICallAndSetData = async (
    callApi,
    setState,
) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.GET,
        `${QUICK_SETUP_GET_MATERIALS_PRICING_ROUTE}`,
        setState,
    );
};


export {quickSetupGetMaterials,quickSetupSaveMaterialCategories, quickSetupSaveMaterialsPricing, quickSetupGetMaterialsPricing};
