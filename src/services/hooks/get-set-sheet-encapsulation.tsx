import { ICallApi, ISetState } from "./call-api.interface";

import { returnResult } from "@/utils/helpers";
import { ShowSubTableForSheetEncapsulation } from "@/pages/materials/sheet-encapsulation/show-sizes-list";
import { UpdateSheetEncapsulationStock } from "@/pages/materials/sheet-encapsulation/update-sheet-encapsulation-stock/update-sheet-encapsulation-stock";

const getAndSetSheetEncapsulationCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/sheet-encapsulation/get-categories",
    data
  );
  return returnResult(result, setState);
};
const getAndSetSheetEncapsulationSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/sheet-encapsulation/get-sizes",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      width: size.width,
      height: size.height,
      weight: size.weight,
      thickness: size.thickness,
      quantityInPackage: size.quantityInPackage,
      stock: (
        <UpdateSheetEncapsulationStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      pricePerUnit: size.pricePerUnit,
      settings: <ShowSubTableForSheetEncapsulation item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export {
  getAndSetSheetEncapsulationCategory,
  getAndSetSheetEncapsulationSizes,
};
