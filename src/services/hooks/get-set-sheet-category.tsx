import { returnResult } from "@/utils/helpers";
import { SheetPageMoreCircle } from "@/pages/materials/sheet-paper/more-circle";
import { ShowSupplierListForSheet } from "@/pages/materials/sheet-paper/show-supplier-list";
import { UpdateStockSheetPaperSizeses } from "@/pages/materials/sheet-paper/more-circle/update-stock-sheet-paper";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetSheetCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/sheets/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetSheetWeights = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/sheets/get-weights", data);
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        weight: item?.weight,
        thickness: item?.thickness,
        pricePerTon: item?.pricePerTon,
        settings: <SheetPageMoreCircle item={item} />,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};
const getAndSetSheetSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi("GET", "/v1/sheets/get-sizes", data);
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        code: item?.code,
        growingUp: `${item?.width}/${item?.height}`, //Width\Height
        pricePerUnit: item?.pricePerUnit,
        pricePerTon: item?.pricePerTon,
        direction: item?.direction,
        //stock: item?.stock,
        stock: (
          <UpdateStockSheetPaperSizeses
            categoryName={data.categoryName}
            sizeId={item.sizeId}
            stockValue={item.stock}
            weightId={item.weightId}
          />
        ),
        settings: (
          <ShowSupplierListForSheet
            item={item}
            categoryName={data?.categoryName}
            weightId={data?.weightId}
            supplierId={data?.supplierId}
          />
        ),
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

export { getAndSetSheetCategory, getAndSetSheetWeights, getAndSetSheetSizes };
