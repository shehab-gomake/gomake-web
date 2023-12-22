import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetProfitsPricingTables = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/get-profits-pricing-tables",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetProfitsPricingTables };
