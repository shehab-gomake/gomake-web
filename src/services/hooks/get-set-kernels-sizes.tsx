import { ShowSubTableForTubes } from "@/pages/materials/tubes/show-sizes-list";
import { UpdateStockTubes } from "@/pages/materials/tubes/update-stock-kernels/update-kernels";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetTubessCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/tubes/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetTubessSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};

const getAndSetTubessSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/tubes/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      lenght: size.lenght,
      diameter: size.diameter,
      weight: size.weight,
      stock: (
        <UpdateStockTubes
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      price: size.price,
      settings: <ShowSubTableForTubes item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetAllSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/tubes/get-all-sizes", data);
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

const getAndSetTubesSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/tubes/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
export {
  getAndSetTubessCategores,
  getAndSetTubessSuppliers,
  getAndSetTubessSize,
  getAndSetAllSizes,
  getAndSetTubesSuppliers,
};
