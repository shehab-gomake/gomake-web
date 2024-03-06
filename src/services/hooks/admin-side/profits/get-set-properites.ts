import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetProperites = async (
  callApi: ICallApi,
  setState?: ISetState,
  router?: any
) => {
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/print-house-action/get-properties-by-action-id/${router.query.actionId}`
  );
  return returnResult(result, setState);
};

export { getAndSetProperites };
