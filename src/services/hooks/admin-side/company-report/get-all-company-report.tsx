import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAllCompanyReport = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/api/PrintHouses/GetPrintHousesReport",
    data
  );
  return returnResult(result, setState);
};

export { getAllCompanyReport };
