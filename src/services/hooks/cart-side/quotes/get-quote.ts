import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetQuotes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/erp-service/quote/get-quotes",
    data
  );
  console.log("result", result);
  return returnResult(result, setState);
};

export { getAndSetQuotes };
