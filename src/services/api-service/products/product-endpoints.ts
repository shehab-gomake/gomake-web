import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const ADD_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/add-profit-rule";
const ORDER_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/order-profit-rules";
const Delete_PRODUCT_PROFIT_RULE_URL = "/v1/printhouse-config/products/delete-profit-rule";
const GET_PRODUCT_PROFIT_RULES_URL = "/v1/printhouse-config/products/get-product-profit-rules/";
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

export {addProductProfitRuleApi, getProductProfitRulesApi, deleteProductProfitRuleApi, orderProductProfitRuleApi}