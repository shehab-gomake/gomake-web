import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetActionProfitRowChartData = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any,
  pricingBy?: number
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/get-action-profit-row-chart-data",
    data,
    false
  );
  const _data = returnResult(result, undefined);
  const costAxis = [];
  const quantityAxis = [];
  const profitAxis = [];
  const mapData = _data.map((item: any) => {
    costAxis.push(item.cost);
    quantityAxis.push(item.quantity || 0);
    profitAxis.push(item.profit);
  });
  if (setState) {
    setState({
      costAxis,
      quantityAxis,
      profitAxis,
    });
  }

  return _data;
};

export { getAndSetActionProfitRowChartData };
