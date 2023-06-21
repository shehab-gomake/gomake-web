import { returnResult } from "@/utils/helpers";
import { ShowSubTableForFrames } from "@/pages/materials/frames/show-sizes-list";
import { UpdateFramesStock } from "@/pages/materials/frames/update-frames-stock/update-frames-stock";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetFramesCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/frames/get-categories", data);
  return returnResult(result, setState);
};
const getAndSetFramesSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/frames/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      categoryName: size.categoryName,
      width: size.width,
      height: size.height,
      weight: size.weight,
      color: size.color,
      thickness: size.thickness,
      stock: (
        <UpdateFramesStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      price: size.price,
      settings: <ShowSubTableForFrames item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetFramesSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/frames/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
const getAndSetAllFramesSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/frames/get-all-sizes", data);
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
  getAndSetFramesCategory,
  getAndSetFramesSizes,
  getAndSetFramesSuppliers,
  getAndSetAllFramesSizes,
};
