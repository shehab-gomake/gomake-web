import { ShowSupplierListForEnvelopes } from "@/pages/materials/envelopes/show-supplier-list";
import { UpdateStockEnvelopes } from "@/pages/materials/envelopes/update-stock-envelopes/update-envelopes-envelopes";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetEnvelopsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/envelopes/get-categories",
    data
  );
  return returnResult(result, setState);
};

const getAndSetEnvelopsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};

const getAndSetEnvelopseSize = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/envelopes/get-sizes", data);
  const _data = returnResult(result, undefined);
  const mapData = _data.map((size: any) => {
    return {
      categoryName: size.categoryName,
      height: size.height,
      width: size.width,
      quantityInPackage: size.quantityInPackage,
      isWithWindow: size.isWithWindow ? "yes" : "no",
      stock: (
        <UpdateStockEnvelopes
          categoryName={size.categoryName}
          sizeId={size.sizeId}
          stockValue={size.stock}
        />
      ),
      price: size.price,
      settings: (
        <ShowSupplierListForEnvelopes
          item={""}
          categoryName={""}
          weightId={""}
          supplierId={""}
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
  getAndSetEnvelopsCategores,
  getAndSetEnvelopsSuppliers,
  getAndSetEnvelopseSize,
};
