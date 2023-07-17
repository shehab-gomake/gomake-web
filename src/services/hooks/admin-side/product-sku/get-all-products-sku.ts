import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAlltProductSKU = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-all-products-sku",
    data
  );
  return returnResult(result, setState);
};

export { getAlltProductSKU };
