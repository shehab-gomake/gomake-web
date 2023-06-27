import { returnResult } from "@/utils/helpers";
import { UpdateStockBrace } from "@/pages/materials/plats/update-stock-brace/update-stock-brace";

import { ICallApi, ISetState } from "./call-api.interface";
import { ShowSubTableForPlats } from "@/pages/materials/plats/show-sizes-list";

const getAndSetPlatsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/plats/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetBraceSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};
const getAndSetBraceSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/plats/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      height: size.height,
      width: size.width,
      stock: (
        <UpdateStockBrace
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      price: size.price,
      settings: <ShowSubTableForPlats item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetPlatsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/plats/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
const getAndSetAllPlatsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/plats/get-all-sizes", data);
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
export {
  getAndSetPlatsCategores,
  getAndSetBraceSuppliers,
  getAndSetBraceSize,
  getAndSetPlatsSuppliers,
  getAndSetAllPlatsSizes,
};
