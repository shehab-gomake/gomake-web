import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetClientTypes = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/crm-service/clients/get-all-client-types",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetClientTypes };
