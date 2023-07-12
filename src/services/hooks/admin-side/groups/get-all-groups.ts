import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAllGroups = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/groups/get-all-groups",
    data
  );
  return returnResult(result, setState);
};

export { getAllGroups };
