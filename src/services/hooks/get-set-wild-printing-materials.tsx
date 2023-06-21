import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";
import { WildPrintingMaterialsPageMoreCircle } from "@/pages/materials/wild-printing-materials/more-circle";
import { UpdateStockWildPrintingMaterialSizeses } from "@/pages/materials/wild-printing-materials/more-circle/update-stock-sheet-paper";
import { ShowSupplierListForWildPrintingMaterial } from "@/pages/materials/wild-printing-materials/show-supplier-list";

const getAndSetWildPrintingMaterialCategory = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/wide-format-material/get-categories",
    data
  );
  return returnResult(result, setState);
};
const getAndSetWildPrintingMaterialTypes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/wide-format-material/get-types",
      data
    );
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        thickness: item?.thickness,
        weightPerMeterSquare: item?.weightPerMeterSquare,
        hardness: item?.hardness,
        settings: <WildPrintingMaterialsPageMoreCircle item={item} />,
      };
    });
    if (setState) {
      setState(mapData);
    }

    return _data;
  }
};

// const getAndSetSheetDirection = async (
//   callApi: ICallApi,
//   setState?: ISetState,
//   data?: any
// ) => {
//   const result: any = await callApi("GET", "/v1/sheets/get-directions", data);
//   return returnResult(result, setState);
// };

const getAndSetWildPrintingMaterialSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/wide-format-material/get-sizes",
      data
    );
    const _data = returnResult(result, undefined);
    const mapData = _data.map((item: any) => {
      return {
        code: item?.code,
        size: `${item?.width}X${item?.height}`,
        hardness: item?.hardness,
        thickness: item?.thickness,
        pricePerMeterSquare: item?.pricePerMeterSquare,
        stock: (
          <UpdateStockWildPrintingMaterialSizeses
            categoryName={data.categoryName}
            sizeId={item.sizeId}
            stockValue={item.stock}
            typeId={item.typeId}
          />
        ),
        settings: (
          <ShowSupplierListForWildPrintingMaterial
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
const getAndSetWideFormatMaterialSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/wide-format-material/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
const getAndSetAllWideFormatMaterialSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/wide-format-material/get-all-sizes",
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
  getAndSetWildPrintingMaterialCategory,
  getAndSetWildPrintingMaterialTypes,
  getAndSetWildPrintingMaterialSizes,
  getAndSetWideFormatMaterialSuppliers,
  getAndSetAllWideFormatMaterialSizes,
};
