import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const CONNECT_TO_STRIPE_URL = "/v1/print-houses/connect-to-stripe";
const STRIPE_CONNECTION_SUCCESS = "/v1/print-houses/stripe-connect-success";
const STRIPE_PAYMENT_SUCCESS = "/v1/erp-service/orders/stripe-payment-success";

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
const stripeConnectionSuccessApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
      callApi,
      EHttpMethod.POST,
      STRIPE_CONNECTION_SUCCESS,
      setState,
      undefined,
      true,
      null,
      true
  );
};
const stripePaymentSuccess: ICallAndSetData = async (callApi, setState,recordId:string) => {
  return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      STRIPE_PAYMENT_SUCCESS + "?recordId="+recordId,
      setState,
      undefined,
      true,
      null,
      true
  );
};
export { connectToStripeApi ,stripeConnectionSuccessApi,stripePaymentSuccess};
