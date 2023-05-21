import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetEmployees = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi("GET", "/v1/employee/get-employee", data);
  console.log(data);
  return returnResult(result, setState);
};

export { getAndSetEmployees };
