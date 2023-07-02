import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";
import { ApplicationsMoreCircle } from "@/pages/materials/applications/more-circle";
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
        sizeName: item?.sizeName,
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
const getAndSetApplicationsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/applications/get-supplier-by-category",
    data
  );
  return returnResult(result, undefined);
};
const getAndSetAllApplicationsSizes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  if (data?.categoryName) {
    const result: any = await callApi(
      "GET",
      "/v1/applications/get-all-sizes",
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
  getAndSetApplicationsCategory,
  getAndSetApplicationSizes,
  getAndSetApplicationThickness,
  getAndSetApplicationsSuppliers,
  getAndSetAllApplicationsSizes,
};
