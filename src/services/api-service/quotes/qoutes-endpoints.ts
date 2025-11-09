import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const ADD_ITEM_TO_QUOTE_URL = "/v1/erp-service/quote/add-item";
const GET_DATA_FOR_AUTO_PRICING_ACTIONS_CHART_URL =
  "/v1/erp-service/quote/get-data-for-auto-pricing-actions-chart";

const EXPORT_DATA_FOR_PROFITS_BY_ACTION_URL =
  "/v1/erp-service/quote/export-data-for-profits-by-action";
const CREATE_QUOTE_FROM_QUALITY_ISSUE_URL =
  "/v1/erp-service/quote/create-quote-from-quality-issue";

const addItemToQuoteApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_ITEM_TO_QUOTE_URL,
    setState,
    data
  );
};

const getDataForAutoPricingActionsChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_DATA_FOR_AUTO_PRICING_ACTIONS_CHART_URL,
    setState,
    data
  );
};

const exportDataForProfitsByActionApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    EXPORT_DATA_FOR_PROFITS_BY_ACTION_URL,
    setState
  );
};

const createQuoteFromQualityIssueApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_QUOTE_FROM_QUALITY_ISSUE_URL,
    setState,
    data
  );
};

export {
  addItemToQuoteApi,
  getDataForAutoPricingActionsChartApi,
  exportDataForProfitsByActionApi,
  createQuoteFromQualityIssueApi,
};
