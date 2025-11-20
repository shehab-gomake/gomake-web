import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const GET_LAST_VERSION_URL = "/v1/admin/gomake-versioning/get-last-version";
const GET_LAST_DEPLOYED_VERSION_URL = "/v1/admin/gomake-versioning/get-last-deployed-version";
const UPDATE_USER_VERSION_URL =
  "/v1/admin/gomake-versioning/update-user-version";

const getLastVersionApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_LAST_VERSION_URL,
    setState
  );
};

const getLastDeployedVersionApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_LAST_DEPLOYED_VERSION_URL,
    setState
  );
};

const updateUserVersionApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    UPDATE_USER_VERSION_URL,
    setState
  );
};

export { getLastVersionApi, getLastDeployedVersionApi, updateUserVersionApi };
