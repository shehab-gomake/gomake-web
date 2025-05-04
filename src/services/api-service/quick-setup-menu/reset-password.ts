import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const SET_USER_NEW_PASSWORD_URL = "/v1/crm-service/users/set-user-new-password";

const setUserNewPasswordApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SET_USER_NEW_PASSWORD_URL,
    setState,
    data
  );
};

export { setUserNewPasswordApi };
