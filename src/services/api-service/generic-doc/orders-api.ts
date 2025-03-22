import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_PROFITS_CHART_DATA_URL =
  "/v1/erp-service/orders/get-profits-chart-data";

const getProfitsChartDataApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PROFITS_CHART_DATA_URL,
    setState,
    data
  );
};

export { getProfitsChartDataApi };
