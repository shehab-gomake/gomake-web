import { ShowSubTableForVarnishs } from "@/pages/materials/varnishs/show-colors-list";
import { ICallApi, ISetState } from "./call-api.interface";

import { UpdateVarnishsStock } from "@/pages/materials/varnishs/update-varnishs-stock/update-varnishs-stock";

import { returnResult } from "@/utils/helpers";

const getAndSetAllVarnishs = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/varnishs/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      typeName: size.typeName,
      volumeInLiters: size.volumeInLiters,
      weightPerLiter: size.weightPerLiter,
      literInSquareMeter: size.literInSquareMeter,
      stock: <UpdateVarnishsStock stockValue={size.stock} code={size.code} />,
      pricePerContainer: size.pricePerContainer,
      pricePerLiter: size.pricePerLiter,
      settings: <ShowSubTableForVarnishs item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetAllVarnishs };
