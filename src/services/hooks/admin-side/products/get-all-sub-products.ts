import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAllSubProducts = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-all-sub-products",
    data
  );
  return returnResult(result, setState);
};

export { getAllSubProducts };
