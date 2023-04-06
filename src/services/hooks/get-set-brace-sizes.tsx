import { returnResult } from "@/utils/helpers";
import { ShowSupplierListForSheet } from "@/pages/materials/braces/show-supplier-list";
import { UpdateStockBrace } from "@/pages/materials/braces/more-circle/update-stock-brace";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetBraceCategores = async (
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
      settings: (
        <ShowSupplierListForSheet
          item={size}
          categoryName={""}
          weightId={""}
          supplierId={""}
        />
      ),
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetBraceCategores, getAndSetBraceSuppliers, getAndSetBraceSize };
