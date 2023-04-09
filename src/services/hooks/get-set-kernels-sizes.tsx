import { ShowSupplierListForKernels } from "@/pages/materials/kernels/show-supplier-list";
import { UpdateStockKernels } from "@/pages/materials/kernels/update-stock-kernels/update-envelopes-kernels";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetKernelsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/tubes/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetKernelsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};

const getAndSetKernelsSize = async (
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
        <UpdateStockKernels
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      price: size.price,
      settings: (
        <ShowSupplierListForKernels
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

export {
  getAndSetKernelsCategores,
  getAndSetKernelsSuppliers,
  getAndSetKernelsSize,
};
