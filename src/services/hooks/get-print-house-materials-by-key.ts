import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getPrintHouseMaterialsByMaterialKey = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/materials/get-print-house-materials-by-key",
    data
  );
  const _data = returnResult(result, undefined);
  if (setState) {
    setState(_data);
  }
  return returnResult(result, undefined);
};

export { getPrintHouseMaterialsByMaterialKey };
