import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetExistQuotes = async (
  callApi: ICallApi,
  setState?: ISetState,
) => {
  const result: any = await callApi(
    "GET",
    "/v1/erp-service/quote/get-exist-quote",
  );

  if (setState) {
    setState(result?.data?.data?.data?.result);
  } 
  return returnResult(result?.data?.data?.data?.result, setState);
};

export { getAndSetExistQuotes };
