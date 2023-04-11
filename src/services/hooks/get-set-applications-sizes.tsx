import { MoreCircle } from "@/pages/materials/hardboards/more-circle";
import { ShowSupplierListForHardboards } from "@/pages/materials/hardboards/more-circle/show-supplier-list";
import { UpdateStockHardboardsThickness } from "@/pages/materials/hardboards/more-circle/update-stock-hardboards-thickness";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";
import { ApplicationsMoreCircle } from "@/pages/materials/applications/more-circle";
import { ShowSupplierListForSheet } from "@/pages/materials/sheet-paper/show-supplier-list";
import { UpdateStockSheetPaperSizeses } from "@/pages/materials/sheet-paper/more-circle/update-stock-sheet-paper";
import { UpdateStockApplication } from "@/pages/materials/applications/more-circle/update-stock-application";
import { ShowSupplierListForApplication } from "@/pages/materials/applications/show-supplier-list";

const getAndSetApplicationsCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/applications/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetApplicationSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/applications/get-thickness",
    data
  );
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      categoryName: size.categoryName,
      thickness: size.thickness,
      weightPerSquareMeter: size.weightPerSquareMeter,
      settings: <ApplicationsMoreCircle item={size} />,
    };
  });
  if (setState) {
    setState(mapData);
  }
  return _data;
};

const getAndSetApplicationThickness = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/applications/get-sizes",
      data
    );
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        code: item?.code,
        thickness: item?.thickness,
        widthToHeight: `${item?.width}/${item?.height}`,
        pricePerSquareMeter: item?.pricePerSquareMeter,
        stock: (
          <UpdateStockApplication
            categoryName={data.categoryName}
            sizeId={item.sizeId}
            stockValue={item.stock}
            thicknessId={item.thicknessId}
          />
        ),
        settings: <ShowSupplierListForApplication item={item} />,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};
export {
  getAndSetApplicationsCategory,
  getAndSetApplicationSizes,
  getAndSetApplicationThickness,
};
