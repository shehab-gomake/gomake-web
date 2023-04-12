import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";
import { UpdateStockCanvasFrames } from "@/pages/materials/canvas-frames/update-stock-additions/update-stock-additions";

const getAndCanvasFramesCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/canvas-frames/get-categories",
    data
  );
  return returnResult(result, setState);
};
const getAndSetCanvasFramesSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/canvas-frames/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    console.log(size);
    return {
      code: size.code,
      width: size.width,
      height: size.height,
      stock: (
        <UpdateStockCanvasFrames
          code={size.code}
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      price: size.price,
      settings: "ff",
      //  <ShowSubTableForAdditions item={size} />
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndCanvasFramesCategory, getAndSetCanvasFramesSizes };
