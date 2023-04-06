import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};
const getAndSetSuppliersCurrencies = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/suppliers/get-suppliers-currencies",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetSuppliers, getAndSetSuppliersCurrencies };
