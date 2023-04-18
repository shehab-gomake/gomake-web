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
export { getAndSetPackingsCategory, getAndSetPackingsVolumes };
