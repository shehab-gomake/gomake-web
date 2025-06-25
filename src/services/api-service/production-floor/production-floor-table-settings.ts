import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const SAVE_PRODUCTION_FLOOR_TABLE_SETTINGS_URL =
  "/v1/jobs-service/production-floor-table-settings/save-production-floor-table-settings";

const GET_PRODUCTION_FLOOR_TABLE_SETTINGS_URL =
  "/v1/jobs-service/production-floor-table-settings/get-production-floor-table-settings";

const saveProductionFloorTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_PRODUCTION_FLOOR_TABLE_SETTINGS_URL,
    setState,
    data
  );
};

const getProductionFloorTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRODUCTION_FLOOR_TABLE_SETTINGS_URL,
    setState
  );
};

export {
  saveProductionFloorTableSettingsApi,
  getProductionFloorTableSettingsApi,
};
