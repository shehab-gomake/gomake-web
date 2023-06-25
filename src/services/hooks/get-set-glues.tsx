import { ICallApi, ISetState } from "./call-api.interface";

import { UpdateStokGlues } from "@/pages/materials/glues/update-glues-stock/update-glues-stock";
import { ShowSubTableForGlues } from "@/pages/materials/glues/show-glues-list";
import { returnResult } from "@/utils/helpers";

const getAndSetAllGlues = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/glues/get-all", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      typeName: size.typeName,
      volumeInLiters: size.volumeInLiters,
      weightPerLiter: size.weightPerLiter,
      literInSquareMeter: size.literInSquareMeter,
      stock: <UpdateStokGlues stockValue={size.stock} code={size.code} />,
      pricePerContainer: size.pricePerContainer,
      pricePerLiter: size.pricePerLiter,
      settings: <ShowSubTableForGlues item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetAllGlue = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/glues/get-all-codes", data);
  const _data = returnResult(result, undefined);
  console.log("_data", _data);
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

const getAndSetAllGluesData = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/glues/get-all-sizes", data);
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

const getAndSetGluesSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/glues/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
export {
  getAndSetAllGlues,
  getAndSetAllGlue,
  getAndSetAllGluesData,
  getAndSetGluesSuppliers,
};
