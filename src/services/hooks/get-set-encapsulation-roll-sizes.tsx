import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

import { ShowSupplierListForApplication } from "@/pages/materials/applications/show-supplier-list";
import { EncapsulationRollMoreCircle } from "@/pages/materials/encapsulation-roll/more-circle";
import { UpdateStockEncapsulationRoll } from "@/pages/materials/encapsulation-roll/more-circle/update-stock-encapsulation-roll";
import { ShowSupplierListForEncapsulationRoll } from "@/pages/materials/encapsulation-roll/show-supplier-list";

const getAndSetEncapsulationRollsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/roll-encapsulations/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetEncapsulationRollsThickness = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/roll-encapsulations/get-thickness",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      categoryName: size.categoryName,
      thickness: size.thickness,
      weightPerSquareMeter: size.weightPerSquareMeter,
      settings: <EncapsulationRollMoreCircle item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

const getAndSetEncapsulationRollsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/roll-encapsulations/get-sizes",
      data
    );
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        code: item?.code,
        thickness: item?.thickness,
        sizeName: item?.sizeName,
        pricePerSquareMeter: item?.pricePerSquareMeter,
        stock: (
          <UpdateStockEncapsulationRoll
            categoryName={data.categoryName}
            sizeId={item.sizeId}
            stockValue={item.stock}
            thicknessId={item.thicknessId}
          />
        ),
        settings: <ShowSupplierListForEncapsulationRoll item={item} />,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

const getAndSetRollEncapsulationsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/roll-encapsulations/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
export {
  getAndSetEncapsulationRollsCategory,
  getAndSetEncapsulationRollsThickness,
  getAndSetEncapsulationRollsSizes,
  getAndSetRollEncapsulationsSuppliers,
};
