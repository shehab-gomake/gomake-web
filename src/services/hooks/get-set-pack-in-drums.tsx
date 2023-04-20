import { ICallApi, ISetState } from "./call-api.interface";

import { returnResult } from "@/utils/helpers";
import { ShowSubTableForPackinDrums } from "@/pages/materials/packin-drums/show-sizes-list";
import { UpdatePackinDrumsStock } from "@/pages/materials/packin-drums/update-packin-drums-stock/update-packin-drums-stock";

const getAndSetPackInDrumsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/packin-drums/get-categories",
    data
  );
  return returnResult(result, setState);
};
const getAndSetPackInDrumsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/packin-drums/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      code: size.code,
      material: size.material,
      sizeName: size.sizeName,
      stock: (
        <UpdatePackinDrumsStock
          stockValue={size.stock}
          categoryName={size.categoryName}
          sizeId={size.sizeId}
        />
      ),
      drumRingNumber: size.drumRingNumber,
      weight: size.weight,
      pricePerDrum: size.pricePerDrum,
      settings: <ShowSubTableForPackinDrums item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
export { getAndSetPackInDrumsCategory, getAndSetPackInDrumsSizes };
