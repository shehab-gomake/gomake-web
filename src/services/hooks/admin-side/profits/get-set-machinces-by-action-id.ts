import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetMachincesByActionId = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/actions/get-machines-by-action-id",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetMachincesByActionId };
