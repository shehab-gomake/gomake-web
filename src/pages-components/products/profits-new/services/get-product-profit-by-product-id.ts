import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetProductProfitByProductId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/get-product-profit-by-product-id",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetProductProfitByProductId };
