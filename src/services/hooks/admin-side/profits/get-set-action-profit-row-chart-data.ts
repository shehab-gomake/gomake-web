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
    data
  );
  const _data = returnResult(result, undefined);
  console.log("_data", _data);
  const costAxis = [];
  const quantityAxis = [];
  const profitAxis = [];
  const mapData = _data.map((item: any) => {
    costAxis.push(item.cost);
    quantityAxis.push(item.quantity || 0);
    profitAxis.push(item.profit);
  });
  console.log("_data", {
    profitAxis,
    costAxis,
    quantityAxis,
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
