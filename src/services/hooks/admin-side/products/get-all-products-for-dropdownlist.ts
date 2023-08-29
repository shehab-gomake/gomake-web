import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAllProductsForDropDownList = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-all-products-for-dropdownlist",
    data
  );
  console.log(result);
  return returnResult(result, setState);
};

export { getAllProductsForDropDownList };
