import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const saveQuote = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?
) => {
  console.log("data is , " , data)
  const result: any = await callApi(
    "POST",
    "/v1/erp-service/quote/save-quote",
    {
        quoteId : data,
    }
  );
  if (setState) {
    setState([]);
  }
  
  return returnResult(result, setState);
};

export { saveQuote };
