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
  const xAxis = [];
  const yAxis = [];
  const mapData = _data.map((item: any) => {
    console.log(item);
    if (pricingBy === 1) {
      yAxis.push(item.size);
    } else {
      yAxis.push(item.quantity);
    }
    xAxis.push(item.profit);
  });
  if (setState) {
    setState({
      xAxis,
      yAxis,
    });
  }

  return _data;
};

export { getAndSetActionProfitRowChartData };
