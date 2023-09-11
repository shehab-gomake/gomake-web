import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getAndSetEmployees2 = async (
    callApi: ICallApi,
    setState?: ISetState,
    data?: any
  ) => {
    const result: any = await callApi("GET", "/v1/employee/get-all-employees2", data);
    return returnResult(result, setState);
  };
  
export { getAndSetEmployees2 };
