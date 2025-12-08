import { ICallApi, ISetState } from "@/services/hooks/call-api.interface";
import { returnResult } from "@/utils/helpers";

const getAndSetPricingTableConditionProperties = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: { id: string | number }
) => {
  if (!data?.id) {
    throw new Error("id is required");
  }
  
  const result: any = await callApi(
    "GET",
    `/v1/printhouse-config/profits/get-pricing-table-condition-properties/${data.id}`,
    {}
  );
  return returnResult(result, setState);
};

export { getAndSetPricingTableConditionProperties };

