import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetAllActionProfitRowsByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/action-profit-rows/get-all-action-profit-rows-by-action-id",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetAllActionProfitRowsByActionId };
