import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAllMaterials = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/materials/get-all-print-house-materials",
    data
  );
  const _data = returnResult(result, undefined);
  if (setState) {
    setState(_data);
  }
  return returnResult(result, undefined);
};

export { getAllMaterials };
