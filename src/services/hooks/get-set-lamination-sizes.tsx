import { returnResult } from "@/utils/helpers";
import { MoreCircle } from "@/pages/materials/lamination/more-circle";
import { UpdateStockLaminationThickness } from "@/pages/materials/lamination/more-circle/update-stock-lamination-thickness";

import { ICallApi, ISetState } from "./call-api.interface";
import { ShowSubTableForLamination } from "@/pages/materials/lamination/show-thicknes-list";

const getAndSetLaminationSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/lamination/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      category: size.categoryName,
      height: size.height,
      width: size.width,
      settings: <MoreCircle item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }

  return _data;
};
const getAndSetLaminationCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/lamination/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetLaminatioThicknes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/lamination/get-thickness",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((thicknes: any) => {
    return {
      code: thicknes.code,
      thickness: thicknes.thickness,
      coldOrHot: thicknes.coldOrHot ? "hot" : "cold",
      price: thicknes.price,
      stock: (
        <UpdateStockLaminationThickness
          categoryName={data.categoryName}
          sizeId={data.sizeId}
          stockValue={thicknes.stock}
          thicknessId={thicknes.thicknessId}
        />
      ),
      settings: (
        <ShowSubTableForLamination
          item={thicknes}
          categoryName={data?.categoryName}
          sizeId={data?.sizeId}
        />
      ),
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

export {
  getAndSetLaminationSize,
  getAndSetLaminationCategores,
  getAndSetLaminatioThicknes,
};
