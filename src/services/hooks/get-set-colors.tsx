import { ICallApi, ISetState } from "./call-api.interface";

import { returnResult } from "@/utils/helpers";
import { ShowSubTableForColors } from "@/pages/materials/colors/show-colors-list";
import { UpdateColorsStock } from "@/pages/materials/colors/update-colors-stock/update-colors-stock";

const getAndSetAllColors = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/colors/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      colorName: size.colorName,
      volumeInLiters: size.volumeInLiters,
      literInSquareMeter: size.literInSquareMeter,
      pricePerContainer: size.pricePerContainer,
      stock: <UpdateColorsStock stockValue={size.stock} code={size.code} />,
      pricePerLiter: size.pricePerLiter,
      settings: <ShowSubTableForColors item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

const getAndSetAllColorsNew = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/colors/get-all-codes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.key,
      name: size.value,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetAllColorsData = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/colors/get-all-sizes", data);
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        ...item,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

const getAndSetColorsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/colors/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};

export {
  getAndSetAllColors,
  getAndSetAllColorsNew,
  getAndSetAllColorsData,
  getAndSetColorsSuppliers,
};
