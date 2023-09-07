import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetAllEmployees = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/crm-service/employee/get-all-employees",
    data
  );
  return returnResult(result, setState);
};


export { getAndSetAllEmployees };
