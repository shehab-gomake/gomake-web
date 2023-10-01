import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetgetProductQuoteItemById = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/erp-service/quote/get-product-quote-item-by-id",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetgetProductQuoteItemById };
