import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const UPDATE_CONFIGS_URL = "/v1/admin/file-service-configs/update-configs";
const GET_CONFIGS_URL = "/v1/admin/file-service-configs/get-configs";
const GET_HOT_FOLDER_NAMES_URL =
  "/v1/admin/file-service-configs/get-hot-folder-names";

const submitFilesApiSettings: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CONFIGS_URL,
    setState,
    data
  );
};

const getFileServiceConfigs: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CONFIGS_URL,
    setState
  );
};

const getHotFolderNames: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_HOT_FOLDER_NAMES_URL,
    setState
  );
};

export { submitFilesApiSettings, getFileServiceConfigs, getHotFolderNames };
