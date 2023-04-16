import { ICallApi, ISetState } from "./call-api.interface";

import { returnResult } from "@/utils/helpers";
import { ShowSubTableForPackinUnits } from "@/pages/materials/packin-units/show-sizes-list";
import { UpdatePackinUnitsStock } from "@/pages/materials/packin-units/update-packin-units-stock/update-packin-units-stock";

const getAndSetPackInUnitsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/packin-units/get-categories",
    data
  );
  return returnResult(result, setState);
};
const getAndSetPackInUnitsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/packin-units/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      material: size.material,
      sizeName: size.sizeName,
      width: size.width,
      weight: size.weight,
      stock: (
        <UpdatePackinUnitsStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      pricePerUnit: size.pricePerUnit,
      settings: <ShowSubTableForPackinUnits item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetPackInUnitsCategory, getAndSetPackInUnitsSizes };
