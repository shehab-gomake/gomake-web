import { ICallApi, ISetState } from "./call-api.interface";

import { returnResult } from "@/utils/helpers";
import { ShowSubTableForFoils } from "@/pages/materials/foils/show-sizes-list";
import { UpdateFoilsStock } from "@/pages/materials/foils/update-foils-stock/update-foils-stock";

const getAndSetFoilsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/foils/get-categories", data);
  return returnResult(result, setState);
};
const getAndSetFoilsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/foils/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      height: size.height,
      width: size.width,
      stock: (
        <UpdateFoilsStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      pricePerRoll: size.pricePerRoll,
      weightPerSquareMeter: size.weightPerSquareMeter,
      pricePerSquareMeter: size.pricePerSquareMeter,
      thickness: size.thickness,
      settings: <ShowSubTableForFoils item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetFoilsCategory, getAndSetFoilsSizes };
