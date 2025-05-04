import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_PRINT_HOUSE_SETUP_STEPS_URL =
  "/v1/print-houses/get-print-house-setup-steps";
const GET_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL =
  "/v1/print-houses/get-print-house-products-setup-form";
const SAVE_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL =
  "/v1/print-houses/save-print-house-products-setup-form";

const getPrintHouseSetupStepsApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_SETUP_STEPS_URL,
    setState
  );
};

const getPrintHouseProductsSetupFormApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL,
    setState
  );
};

const savePrintHouseProductsSetupFormApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL,
    setState,
    data
  );
};

export {
  getPrintHouseSetupStepsApi,
  getPrintHouseProductsSetupFormApi,
  savePrintHouseProductsSetupFormApi,
};
