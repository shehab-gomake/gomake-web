import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetCalculateCaseProfits = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  console.log("data", data);
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-calculate-case-profits/${data?.actionId}/${data?.productItemValueId}`,
    data
  );
  return returnResult(result, setState);
};

export { getAndSetCalculateCaseProfits };
