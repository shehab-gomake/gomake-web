import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const CONNECT_TO_STRIPE_URL = "/v1/print-houses/connect-to-stripe";

const connectToStripeApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CONNECT_TO_STRIPE_URL,
    setState,
    undefined,
    true,
    null,
    true
  );
};

export { connectToStripeApi };
