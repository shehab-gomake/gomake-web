import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

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
    return {
      code: size.code,
      name: size.name,
      weight: size.weight,
      adaptationField: size.adaptationField,
      // stock: <UpdateStockAdditions code={size.code} stockValue={size.stock} />,
      price: size.price,
      // settings: <ShowSubTableForAdditions item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndCanvasFramesCategory, getAndSetCanvasFramesSizes };
