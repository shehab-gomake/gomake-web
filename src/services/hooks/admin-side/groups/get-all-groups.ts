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
  console.log(result);
  const groups = returnResult(result, undefined);
  const mappedGroups = groups.map((group: any) => ({
    id: group.id,
    label: group.name,
  }));
  setState(mappedGroups);
  return groups;
};

export { getAllGroups };
