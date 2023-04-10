import { ColoredCycle } from "@/components";
import { UpdateStockPrintingMaterials } from "@/pages/materials/printing-materials-for-rolls/update-stock-printing-materials/update-stock-printing-materials";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";
import { ShowSubTableForPrintingMaterials } from "@/pages/materials/printing-materials-for-rolls/show-sizes-list";

const getAndSetPrintingMaterialsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/material-roll-printings/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetPrintingMaterialsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};

const getAndSetPrintingMaterialsSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/material-roll-printings/get-sizes",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size?.code,
      height: size?.height,
      width: size?.width,
      stock: (
        <UpdateStockPrintingMaterials
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      pricePerSquareMeter: size?.pricePerSquareMeter,
      weightPerSquareMeter: size?.weightPerSquareMeter,
      withPremier: size?.withPremier ? (
        <ColoredCycle backgroundColor={"red"} />
      ) : (
        <ColoredCycle backgroundColor={"green"} />
      ),
      settings: (
        <ShowSubTableForPrintingMaterials
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
  getAndSetPrintingMaterialsCategores,
  getAndSetPrintingMaterialsSuppliers,
  getAndSetPrintingMaterialsSize,
};
