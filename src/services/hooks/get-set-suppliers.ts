import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, undefined);
};

const getAndSetSheetSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/sheets/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
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

const getAndSetAllRollEncapsulationsThikness = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/roll-encapsulations/get-all-sizes",
      data
    );
    const _data = returnResult(result, undefined);
    if (setState) {
      setState(_data);
    }

    return _data;
  }
};
export {
  getAndSetSuppliers,
  getAndSetSuppliersCurrencies,
  getAndSetSheetSuppliers,
  getAndSetAllRollEncapsulationsThikness,
};
