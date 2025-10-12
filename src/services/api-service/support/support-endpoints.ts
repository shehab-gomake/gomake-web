import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const GENERATE_CUSTOMER_LOGIN_LINK_URL =
  "/v1/crm-service/go-support/generate-customer-login-link";
const GET_GO_SUPPORT_USER_TOKEN_URL =
  "/v1/crm-service/go-support/get-go-support-user-token";

const generateCustomerLoginLinkApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GENERATE_CUSTOMER_LOGIN_LINK_URL,
    setState,
    {}
  );
};

const getGoSupportUserTokenApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_GO_SUPPORT_USER_TOKEN_URL,
    setState,
    {}
  );
};

export { generateCustomerLoginLinkApi, getGoSupportUserTokenApi };
