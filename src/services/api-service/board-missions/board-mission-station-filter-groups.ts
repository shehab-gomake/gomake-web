import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const APPLY_STATION_FILTER_GROUP_URL =
  "/v1/erp-service/board-mission-station-filter-groups/apply-station-filter-group";
const GET_STATION_FILTER_BY_GROUP_ID_URL =
  "/v1/erp-service/board-mission-station-filter-groups/get-by-id";
const DELETE_STATION_FILTER_BY_GROUP_ID_URL =
  "/v1/erp-service/board-mission-station-filter-groups/delete-by-id";
const GET_ALL_BOARD_MISSION_STATION_FILTER_GROUPS_URL =
  "/v1/erp-service/board-mission-station-filter-groups/get-all-board-mission-station-filter-groups";
const CREATE_BOARD_MISSION_STATION_FILTER_GROUP_URL =
  "/v1/erp-service/board-mission-station-filter-groups/create-board-mission-station-filter-group";
const GET_JOBS_BY_GROUPS_URL = "/v1/erp-service/board-mission-station-filter-groups/get-jobs-by-groups"
const DUPLICATE_STATION_FILTER_BY_GROUP_ID_URL = "/v1/erp-service/board-mission-station-filter-groups/duplicate-board-mission-station-filter-groups-from-user-to-employees"

const applyStationFilterGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  groupId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    APPLY_STATION_FILTER_GROUP_URL,
    setState,
    groupId
  );
};

const getStationFilterByGroupIdApi: ICallAndSetData = async (
  callApi,
  setState,
  groupId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_STATION_FILTER_BY_GROUP_ID_URL,
    setState,
    groupId
  );
};

const deleteStationFilterByGroupIdApi: ICallAndSetData = async (
  callApi,
  setState,
  groupId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_STATION_FILTER_BY_GROUP_ID_URL,
    setState,
    groupId
  );
};

const getAllBoardMissionStationFilterGroupsApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_BOARD_MISSION_STATION_FILTER_GROUPS_URL,
    setState
  );
};

const createBoardMissionStationFilterGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_BOARD_MISSION_STATION_FILTER_GROUP_URL,
    setState,
    data
  );
};

const duplicateStationFilterByGroupIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DUPLICATE_STATION_FILTER_BY_GROUP_ID_URL,
    setState,
    data
  );
};

const getJobsByGroups: ICallAndSetData = async (
    callApi,
    setState,
    connectionId: string,
    lock = false,
    abortController
) => {
  return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_JOBS_BY_GROUPS_URL + "?connectionId=" + connectionId,
      setState,
      {},
      false,
      abortController
  );
};
export {
  createBoardMissionStationFilterGroupApi,
  getAllBoardMissionStationFilterGroupsApi,
  deleteStationFilterByGroupIdApi,
  getStationFilterByGroupIdApi,
  applyStationFilterGroupApi,
  getJobsByGroups,
  duplicateStationFilterByGroupIdApi
};
