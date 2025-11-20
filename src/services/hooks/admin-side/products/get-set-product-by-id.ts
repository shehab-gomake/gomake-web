import { returnResult } from "@/utils/helpers";
import { ICallApi, ISetState } from "../../call-api.interface";

const getAndSetProductById = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-product-by-id",
    data
  );
  return returnResult(result, setState);
};
const getAndSetChatBotProductId = async (
    callApi: ICallApi,
    setState?: ISetState,
    data?: any
) => {
  const result: any = await callApi(
      "GET",
      "/v1/erp-service/chat-bot/get-chatbot-product-by-id",
      data
  );
  return returnResult(result, setState);
};
const getAndSetProfitProfileReviewProductId = async (
    callApi: ICallApi,
    setState?: ISetState,
    data?: any
) => {
  const result: any = await callApi(
      "GET",
      "/v1/printhouse-config/profit-profile-products/get-product-calculation-review",
      data
  );
  return returnResult(result, setState);
};

const getCompositeProductById = async (
  callApi: ICallApi,
  setState?: ISetState,
  data?: any
) => {
  const result: any = await callApi(
    "GET",
    "/v1/printhouse-config/products/get-composite-product-by-id",
    data
  );
  return returnResult(result, setState);
};

export { getAndSetProductById,getAndSetChatBotProductId,getAndSetProfitProfileReviewProductId, getCompositeProductById };
