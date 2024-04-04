import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_PRODUCTION_FLOOR_DATA_URL = '/v1/erp-service/board-missions';
const UPDATE_WORK_JOB_STATUS_URL = '/v1/erp-service/board-missions/update-board-missions-status';
const SET_FILTERS_BOARDS_MISSIONS_URL = '/v1/erp-service/board-missions/set-filters';
const GET_BOARDS_MISSIONS_BY_ID_URL = '/v1/erp-service/board-missions/board-missions/';
const GET_BOARD_MISSIONS_STATIONS_URL = '/v1/erp-service/board-missions/board-stations';
const UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL = '/v1/erp-service/board-missions/update-board-missions-current-station';
const ADD_NEW_PRODUCTION_GROUP_URL = '/v1/erp-service/board-missions-group/create-group';
const DELETE_PRODUCTION_GROUP_URL = '/v1/erp-service/board-missions-group/delete-group/';
const GET_PRINT_HOUSE_ACTIONS_MACHINES_URL = '/v1/printhouse-config/actions/get-actions-machines';
const GET_BOARDS_MISSIONS_GROUPS_URL = '/v1/erp-service/board-missions/groups/';

const getProductionFloorData: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRODUCTION_FLOOR_DATA_URL, setState, {}, false);
};


const updateBoardsMissionsStatusApi: ICallAndSetData = async (callApi, setState, data: { boardsIds: string[], statusId: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_WORK_JOB_STATUS_URL, setState, data);
};

const updateBoardMissionCurrentStationApi: ICallAndSetData = async (callApi, setState, data: { boardId: string, stationId: string | null }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL, setState, {boardMissionId: data.boardId, newStationId: data.stationId});
};

const setBoardFiltersApi: ICallAndSetData = async (callApi, callBack, filters: {}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SET_FILTERS_BOARDS_MISSIONS_URL, callBack, filters);
}
const getBoardMissionsById: ICallAndSetData = async (callApi, callBack, id) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_BY_ID_URL + id, callBack);
}
const getBoardMissionsActions: ICallAndSetData = async (callApi, callBack, boardId: string) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARD_MISSIONS_STATIONS_URL + `?boardMissionId=${boardId}`, callBack);
}

const addNewBoardMissionsGroup: ICallAndSetData = async (callApi, callBack, group) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_NEW_PRODUCTION_GROUP_URL, callBack, group);
}

const deleteBoardMissionsGroup: ICallAndSetData = async (callApi, callBack, groupId) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, DELETE_PRODUCTION_GROUP_URL + groupId, callBack);
}
const getPrintHouseActions: ICallAndSetData = async (callApi, callBack, ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRINT_HOUSE_ACTIONS_MACHINES_URL , callBack);
}
const getBoardsMissionsGroupsByID: ICallAndSetData = async (callApi, callBack, groupId: string ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_GROUPS_URL + groupId , callBack);
}

export {
    getProductionFloorData,
    updateBoardsMissionsStatusApi,
    setBoardFiltersApi,
    getBoardMissionsById,
    getBoardMissionsActions,
    updateBoardMissionCurrentStationApi,
    addNewBoardMissionsGroup,
    deleteBoardMissionsGroup,
    getPrintHouseActions,
    getBoardsMissionsGroupsByID
};