import { ShowSupplierListForEnvelopes } from "@/pages/materials/envelopes/show-supplier-list";
import { UpdateStockEnvelopes } from "@/pages/materials/envelopes/update-stock-envelopes/update-envelopes-envelopes";
import { returnResult } from "@/utils/helpers";

import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetKernelsCategores = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/tubes/get-categories", data);
  return returnResult(result, setState);
};

const getAndSetKernelsSuppliers = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/suppliers/get-suppliers", data);
  return returnResult(result, setState);
};

export { getAndSetKernelsCategores, getAndSetKernelsSuppliers };
