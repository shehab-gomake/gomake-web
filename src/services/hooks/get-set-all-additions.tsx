import { returnResult } from "@/utils/helpers";
import { ShowSubTableForAdditions } from "@/pages/materials/additions/show-sizes-list";
import { UpdateStockAdditions } from "@/pages/materials/additions/update-stock-additions/update-stock-additions";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetAllAdditions = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/additions/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      name: size.name,
      weight: size.weight,
      adaptationField: size.adaptationField,
      stock: <UpdateStockAdditions code={size.code} stockValue={size.stock} />,
      price: size.price,
      settings: <ShowSubTableForAdditions item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

export { getAndSetAllAdditions };
