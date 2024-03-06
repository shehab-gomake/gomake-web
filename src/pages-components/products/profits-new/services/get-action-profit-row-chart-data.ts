import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetActionProfitRowChartData = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/get-action-profit-row-chart-data",
    data
  );
  const _data = returnResult(result, undefined);
  const costAxis = [];
  const quantityAxis = [];
  const profitAxis = [];
  const mapData = _data.map((item: any) => {
    costAxis.push(item.cost);
    quantityAxis.push(item.quantity || 0);
    profitAxis.push(item.totalPrice);
  });
  if (setState) {
    setState({
      costAxis,
      quantityAxis,
      profitAxis,
    });
  }

  return _data;
  // return returnResult(result, setState);
};

export { getAndSetActionProfitRowChartData };
