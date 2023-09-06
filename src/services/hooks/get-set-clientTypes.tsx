import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetClientTypes = async (
  callApi: ICallApi,
  setState?: ISetState,
) => {
  const result: any = await callApi(
    "GET",
    "/v1/clientTypes/get-all-clientTypes",
  );
  return returnResult(result, setState);
};
    
export {
  getAndSetClientTypes,
};
