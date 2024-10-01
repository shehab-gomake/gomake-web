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
  "/v1/erp-service/board-mission-station-filter-groups/get-by-id";
const CREATE_BOARD_MISSION_STATION_FILTER_GROUP_URL =
  "/v1/erp-service/board-mission-station-filter-groups/create-board-mission-station-filter-group";

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

export {
  createBoardMissionStationFilterGroupApi,
  getAllBoardMissionStationFilterGroupsApi,
  deleteStationFilterByGroupIdApi,
  getStationFilterByGroupIdApi,
  applyStationFilterGroupApi,
};
