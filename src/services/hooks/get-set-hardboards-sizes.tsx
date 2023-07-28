import { MoreCircle } from "@/pages/materials/hardboards/more-circle";
import { ShowSupplierListForHardboards } from "@/pages/materials/hardboards/more-circle/show-supplier-list";
import { UpdateStockHardboardsThickness } from "@/pages/materials/hardboards/more-circle/update-stock-hardboards-thickness";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetHardboardsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/hardboards/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetHardboardSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/hardboards/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      categoryName: size.categoryName,
      height: size.height,
      width: size.width,
      hardness: size.hardness == 1 ? "Hard" : "Not hard",
      settings: <MoreCircle item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

const getAndSetHardboardsThicknes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/hardboards/get-thickness",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((thicknes: any) => {
    return {
      code: thicknes.code,
      thicknessName: thicknes.thicknessName,
      pricePerSquareMeter: thicknes.pricePerSquareMeter,
      height: thicknes.height,
      width: thicknes.width,
      stock: (
        <UpdateStockHardboardsThickness
          categoryName={data.categoryName}
          sizeId={data.sizeId}
          stockValue={thicknes.stock}
          thicknessId={thicknes.thicknessId}
        />
      ),
      settings: (
        <ShowSupplierListForHardboards
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

const getAndSetHardboardsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/hardboards/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};

const getAndSetAllHardboardsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/hardboards/get-all-sizes",
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
  getAndSetHardboardsCategory,
  getAndSetHardboardSizes,
  getAndSetHardboardsThicknes,
  getAndSetHardboardsSuppliers,
  getAndSetAllHardboardsSizes,
};
