import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GOOGLE_O_AUTH = "/v1/communication-service/call-back/google";

const googleOAuth: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GOOGLE_O_AUTH,
    setState,
    data
  );
};

export { googleOAuth };
