import { ShowSubTableForTubes } from "@/pages/materials/kernels/show-sizes-list";
import { ShowSupplierListForKernels } from "@/pages/materials/kernels/show-supplier-list";
import { UpdateStockTubes } from "@/pages/materials/kernels/update-stock-kernels/update-kernels";
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

export {
  getAndSetTubessCategores,
  getAndSetTubessSuppliers,
  getAndSetTubessSize,
};
