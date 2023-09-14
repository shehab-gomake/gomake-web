import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetMachincesNew = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/profits/get-all-machinces-new",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetMachincesNew };
