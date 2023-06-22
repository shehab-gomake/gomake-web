import { returnResult } from "@/utils/helpers";
import { ShowSubTableForAdditions } from "@/pages/materials/additions/show-sizes-list";
import { UpdateStockAdditions } from "@/pages/materials/additions/update-stock-additions/update-stock-additions";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetAllAdditions = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/additions/get-all-codes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      name: size.name,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetAllAdditionsData = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/additions/get-all-sizes",
      data
    );
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        ...item,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

const getAndSetAdditionsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/additions/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
export {
  getAndSetAllAdditions,
  getAndSetAllAdditionsData,
  getAndSetAdditionsSuppliers,
};
