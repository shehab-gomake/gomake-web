import { ICallApi, ISetState } from "./call-api.interface";

import { UpdatePackingsStock } from "@/pages/materials/packings/update-packings-stock/update-packings-stock";
import { ShowSubTableForPackings } from "@/pages/materials/packings/show-sizes-list";
import { returnResult } from "@/utils/helpers";

const getAndSetPackingsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/packings/get-categories", data);
  return returnResult(result, setState);
};
const getAndSetPackingsVolumes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/packings/get-volumes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      height: size.height,
      width: size.width,
      stock: (
        <UpdatePackingsStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          volumeId={size.volumeId}
        />
      ),
      pricePerUnit: size.pricePerUnit,
      settings: <ShowSubTableForPackings item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetPackingsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/packings/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};

const getAndSetAllPackingsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/packings/get-all-sizes",
      data
    );
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
export {
  getAndSetPackingsCategory,
  getAndSetPackingsVolumes,
  getAndSetPackingsSuppliers,
  getAndSetAllPackingsSizes,
};
