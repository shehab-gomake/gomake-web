import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetClientContacts = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/crm-service/customer/get-client-contacts",
    data,
    false
  );
  return returnResult(result, setState);
};

export { getAndSetClientContacts };
