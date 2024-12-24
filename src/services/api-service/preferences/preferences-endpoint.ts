import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
const GET_ALL_PREFERENCES_URL = "/v1/admin/preference/get-all-preferences";
const UPDATE_PREFERENCES_URL = "/v1/admin/preference/update-preferences";

const getAllPreferencesApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PREFERENCES_URL,
    setState
  );
};

const updatePreferencesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PREFERENCES_URL,
    setState,
    data
  );
};

export { getAllPreferencesApi, updatePreferencesApi };
