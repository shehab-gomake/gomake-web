import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
const GET_PIE_PRODUCT_TYPE_CHART_URL =
  "/v1/reports-service/sales/get-pie-product-type-chart";
const GET_PIE_AGENT_CHART_URL = "/v1/reports-service/sales/get-pie-agent-chart";
const GET_SALES_CHART_URL = "/v1/reports-service/sales/get-sales-chart";
const GET_AGENT_PERFORMANCE_CHART_URL =
  "/v1/reports-service/sales/get-agent-performance-chart";
const GET_CLIENT_PERFORMANCE_CHART_URL =
  "/v1/reports-service/sales/get-client-performance-chart";
const GET_PRODUCT_PERFORMANCE_CHART_URL =
  "/v1/reports-service/sales/get-product-performance-chart";
const GET_DAILY_DOCUMENTS_SUMMARY_URL =
  "/v1/reports-service/sales/get-daily-documents-summary";

const getSalesChartRouteApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_SALES_CHART_URL,
    setState,
    data
  );
};

const getPieProductTypeChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_PIE_PRODUCT_TYPE_CHART_URL,
    setState,
    data
  );
};

const getAgentPerformanceChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_AGENT_PERFORMANCE_CHART_URL,
    setState,
    data
  );
};

const getProductPerformanceChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_PRODUCT_PERFORMANCE_CHART_URL,
    setState,
    data
  );
};

const getClientPerformanceChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_CLIENT_PERFORMANCE_CHART_URL,
    setState,
    data
  );
};

const getPieAgentChartApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_PIE_AGENT_CHART_URL,
    setState,
    data
  );
};

const getDailyDocumentsSummaryApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_DAILY_DOCUMENTS_SUMMARY_URL,
    setState,
    data
  );
};

export {
  getSalesChartRouteApi,
  getPieAgentChartApi,
  getPieProductTypeChartApi,
  getAgentPerformanceChartApi,
  getClientPerformanceChartApi,
  getProductPerformanceChartApi,
  getDailyDocumentsSummaryApi,
};
