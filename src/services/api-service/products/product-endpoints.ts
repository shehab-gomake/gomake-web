import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const ADD_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/add-profit-rule";
const ORDER_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/order-profit-rules";
const Delete_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/delete-profit-rule";
const GET_PRODUCT_PROFIT_RULES_URL = "/v1/printhouse-config/products/get-product-profit-rules/";
const GET_ALL_PRODUCT_AND_MATERIALS_URL = "/v1/printhouse-config/products/get-all-products-and-materials-for-dropdownlist";
const GET_ALL_PRICING_PROFILE_SETTING_FOR_DROP_DOWN_LIST_URL = "/v1/printhouse-config/pricing-profile-settings/get-all-pricing-profile-setting-for-drop-down-list";
const GET_ALL_PROFIT_PROFILE_PRODUCT_BY_PRODUCT_ID_URL = "/v1/printhouse-config/profit-profile-products/get-all-profit-profile-product-by-product-id";
const UPDATE_PROFIT_PROFILE_PRODUCT_PARAMETER_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-parameter";

const UPDATE_PROFIT_PROFILE_PRODUCT_QUANTITIES_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-quantities";
const UPDATE_PRINT_HOUSE_PRICE_URL = "/v1/printhouse-config/profit-profile-products/update-print-house-price";

const UPDATE_PROFIT_PROFILE_PRODUCT_HIDDEN_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-hidden";
const UPDATE_PROFIT_PROFILE_PRODUCT_SELECTED_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-selected";
const UPDATE_SELECTED_PRINT_HOUSE_PRICES_URL = "/v1/printhouse-config/profit-profile-products/update-selected-print-house-prices";
const UPDATE_PROFIT_PROFILE_PRODUCT_MATERIAL_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-material";
const UPDATE_PROFIT_PROFILE_PRODUCT_MACHINE_URL = "/v1/printhouse-config/profit-profile-products/update-profit-profile-product-machine";
const RESET_PRINT_HOUSE_PRICE_URL = "/v1/printhouse-config/profit-profile-products/reset-print-house-price";

const GET_PROFITS_PROFILE_PDF_URL = "/v1/printhouse-config/profit-profile-products/get-profits-profile-pdf";

const GET_PRODUCT_SIZES_URL = "/v1/printhouse-config/products/get-product-sizes";
const RE_CALCULATE_PRICE_URL = "/v1/printhouse-config/products/calculate-products";

const addProductProfitRuleApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_PRODUCT_PROFIT_RULE_URL, setState, data);
};
const orderProductProfitRuleApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, ORDER_PRODUCT_PROFIT_RULE_URL, setState, data);
};
const deleteProductProfitRuleApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, `${Delete_PRODUCT_PROFIT_RULE_URL}/${data?.productId}/${data?.ruleId}`, setState, data);
};
const getProductProfitRulesApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRODUCT_PROFIT_RULES_URL + data, setState);
};

const getAllProductAndMaterialsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PRODUCT_AND_MATERIALS_URL ,setState, data);
};

const getAllPricingProfileSettingForDropDownListApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PRICING_PROFILE_SETTING_FOR_DROP_DOWN_LIST_URL ,setState,false);
};

const getAllProfitProfileProductByProductIdApi: ICallAndSetData = async (callApi, setState, data,lock,abort) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_PROFIT_PROFILE_PRODUCT_BY_PRODUCT_ID_URL ,setState, data,lock,abort);
};
const updateProfitProfileProductParameterApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_PARAMETER_URL ,setState, data);
};

const updateProfitProfileProductQuantitiesApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_QUANTITIES_URL ,setState, data);
};
const updatePrintHousePriceApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PRINT_HOUSE_PRICE_URL ,setState, data);
};
const updateProfitProfileProductHiddenApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_HIDDEN_URL ,setState, data);
};

const updateProfitProfileProductSelectedApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_SELECTED_URL ,setState, data);
};
const updateSelectedPrintHousePricesApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_SELECTED_PRINT_HOUSE_PRICES_URL ,setState, data);
};
const resetPrintHousePriceApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, RESET_PRINT_HOUSE_PRICE_URL ,setState, data);
};
const updateProfitProfileProductMaterialApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_MATERIAL_URL ,setState, data);
};

const updateProfitProfileProductMachineApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PROFIT_PROFILE_PRODUCT_MACHINE_URL ,setState, data);
};

const getProfitsProfilePdfApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_PROFITS_PROFILE_PDF_URL,
      setState,
      data
    );
  };

  const getProductSizesApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRODUCT_SIZES_URL, setState, data);
};
  const reCalculatePriceApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, RE_CALCULATE_PRICE_URL ,setState, data);
};

export {
    addProductProfitRuleApi,
    getProductProfitRulesApi,
    deleteProductProfitRuleApi,
    orderProductProfitRuleApi,
    getAllProductAndMaterialsApi,
    getAllPricingProfileSettingForDropDownListApi,
    getAllProfitProfileProductByProductIdApi,
    updateProfitProfileProductParameterApi,
    updateProfitProfileProductQuantitiesApi,
    updatePrintHousePriceApi,
    updateProfitProfileProductHiddenApi,
    updateProfitProfileProductSelectedApi,
    updateSelectedPrintHousePricesApi,
    updateProfitProfileProductMaterialApi,
    getProfitsProfilePdfApi,
    updateProfitProfileProductMachineApi,
    resetPrintHousePriceApi,
    getProductSizesApi,
    reCalculatePriceApi
}
