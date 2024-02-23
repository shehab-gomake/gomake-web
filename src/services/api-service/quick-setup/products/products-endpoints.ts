import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_QUICK_SETUP_PRODUCTS_URL = "/v1/print-house-config/products/quick-setup/get-all-products";
const UPDATE_QUICK_SETUP_PRODUCT_PRICE_URL = "/v1/print-house-config/products/quick-setup/update-product-price";
const getQuickSetupProducts: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.GET,
        GET_QUICK_SETUP_PRODUCTS_URL,
        setState,
    );
};const updateQuickSetupProductPrice: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
        callApi,
        EHttpMethod.POST,
        UPDATE_QUICK_SETUP_PRODUCT_PRICE_URL,
        setState,
        data
    );
};

export {getQuickSetupProducts, updateQuickSetupProductPrice}