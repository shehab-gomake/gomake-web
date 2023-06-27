import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetAllParameters = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/parameters/get-all-parameters",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetAllParameters };
