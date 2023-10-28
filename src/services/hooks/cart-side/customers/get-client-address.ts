import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetClientAddress = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/crm-service/customer/get-client-address",
    data,
    false
  );
  return returnResult(result, setState);
};

export { getAndSetClientAddress };
