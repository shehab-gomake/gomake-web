import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { SetupStepItem } from "@/store/print-house-setup-state-state";

const GET_PRINT_HOUSE_SETUP_STEPS_URL =
  "/v1/print-houses/get-print-house-setup-steps";
const GET_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL =
  "/v1/print-houses/get-print-house-products-setup-form";
const SAVE_PRINT_HOUSE_PRODUCTS_SETUP_FORM_URL =
  "/v1/print-houses/save-print-house-products-setup-form";

const UPDATE_PRINT_HOUSE_SETUP_STEPS_URL =
  "/v1/print-houses/update-print-house-setup-steps";

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

const updatePrintHouseSetupStepsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: SetupStepItem
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_PRINT_HOUSE_SETUP_STEPS_URL,
    setState,
    data
  );
};

export {
  getPrintHouseSetupStepsApi,
  getPrintHouseProductsSetupFormApi,
  savePrintHouseProductsSetupFormApi,
  updatePrintHouseSetupStepsApi,
};
