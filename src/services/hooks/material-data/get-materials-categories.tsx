import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "./call-api.interface";

const getMaterialsCategories = async (
  callApi: ICallApi,
  setState?: ISetState,
  url?: string,
  data?: any
) => {
  const result: any = await callApi("GET", url, data);
  return returnResult(result, setState);
};

export { getMaterialsCategories };
