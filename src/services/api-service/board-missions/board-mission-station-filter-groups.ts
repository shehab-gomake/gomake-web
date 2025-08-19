import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import {IProductionFloorFilter} from "@/widgets/production-floor/interfaces/filters";

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

const GET_STATION_FILTER_GROUP_BY_ID_URL = "/v1/erp-service/board-mission-station-filter-groups/get-station-filter-group-by-id"
const UPDATE_STATION_FILTER_GROUP_URL = "/v1/erp-service/board-mission-station-filter-groups/update-station-filter-group"
const GET_ALL_BOARD_MISSION_STATUS_URL = "/v1/erp-service/board-missions/statuses/get-all"

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

const getStationFilterGroupByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  id
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_STATION_FILTER_GROUP_BY_ID_URL,
    setState,
    id
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
    data:{
      connectionId:string;
      filters?:IProductionFloorFilter
    },
    lock= true,
    abortController
) => {
  return await getSetApiData(
      callApi,
      EHttpMethod.POST,
      GET_JOBS_BY_GROUPS_URL + "?connectionId=" + data.connectionId,
      setState,
      data.filters,
      true,
      abortController
  );
};

const updateStationFilterGroupApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_STATION_FILTER_GROUP_URL,
    setState,
    data
  );
};

const getAllBoardMissionStatusApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_BOARD_MISSION_STATUS_URL,
    setState
  );
};
export {
  createBoardMissionStationFilterGroupApi,
  getAllBoardMissionStationFilterGroupsApi,
  deleteStationFilterByGroupIdApi,
  getStationFilterByGroupIdApi,
  applyStationFilterGroupApi,
  getJobsByGroups,
  duplicateStationFilterByGroupIdApi,
  getStationFilterGroupByIdApi,
  updateStationFilterGroupApi,
  getAllBoardMissionStatusApi
};
