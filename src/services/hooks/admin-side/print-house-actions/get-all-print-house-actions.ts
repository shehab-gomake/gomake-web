import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAllPrintHouseActions = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/get-all-print-house-actions",
    data
  );
  return returnResult(result, setState);
};

export { getAllPrintHouseActions };
