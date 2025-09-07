import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const FORGET_PASSWORD_URL = "/v1/crm-service/users/forget-password";

const forgetPasswordApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    FORGET_PASSWORD_URL,
    setState,
    data
  );
};

export { forgetPasswordApi };


