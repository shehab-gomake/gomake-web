import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";
import { UpdateStockProfileFrame } from "@/pages/materials/profile-frames/update-stock-profile-frame/update-stock-profile-frame";
import { ShowSubTableForProfileFrame } from "@/pages/materials/profile-frames/show-sizes-list";

const getAndSetProfileFrameCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/profile-frames/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetProfileFramesSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/profile-frames/get-sizes",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size?.code,
      height: size?.height,
      width: size?.width,
      stock: (
        <UpdateStockProfileFrame
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      pricePerUnit: size?.pricePerUnit,
      pricePerMeter: size?.pricePerMeter,
      settings: <ShowSubTableForProfileFrame item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};

const getAndSetProfileFramesSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/profile-frames/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
const getAndSetAllProfileFramesSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/profile-frames/get-all-sizes",
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
  getAndSetProfileFrameCategores,
  getAndSetProfileFramesSize,
  getAndSetProfileFramesSuppliers,
  getAndSetAllProfileFramesSizes,
};
