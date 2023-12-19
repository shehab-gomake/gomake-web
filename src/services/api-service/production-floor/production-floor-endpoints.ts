import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
import {IBoardMissions} from "@/widgets/board-mission-widget/interface";

const GET_MORE_BOARDS_MISSIONS_URL = '/v1/erp-service/board-missions/get-more';
const UPDATE_WORK_JOB_STATUS_URL = '/v1/erp-service/board-missions/update-board-missions-status';
const SET_FILTERS_BOARDS_MISSIONS_URL = '/v1/erp-service/board-missions/set-filters';
const GET_BOARDS_MISSIONS_BY_ID_URL = '/v1/erp-service/board-missions/board-missions/';
const GET_BOARD_MISSIONS_STATIONS_URL = '/v1/erp-service/board-missions/board-stations';
const UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL = '/v1/erp-service/board-missions/update-board-missions-current-station';

const getMoreBoardMissions: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_MORE_BOARDS_MISSIONS_URL, setState, {}, false);
};


const updateBoardsMissionsStatusApi: ICallAndSetData<any, any> = async (callApi, setState, data: {boardsIds: string[], statusId: string}) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_WORK_JOB_STATUS_URL, setState, data);
};

const updateBoardMissionCurrentStationApi: ICallAndSetData<any, any> = async (callApi, setState, data: {boardId: string, stationId: string}) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL, setState, data);
};

const setBoardFiltersApi: ICallAndSetData<any, any> = async (callApi, callBack, filters: {}) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, SET_FILTERS_BOARDS_MISSIONS_URL, callBack, filters);
}
const getBoardMissionsById: ICallAndSetData<IBoardMissions, string> = async (callApi, callBack, id) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_BY_ID_URL + id, callBack);
}
const getBoardMissionsActions: ICallAndSetData<any, any> = async (callApi, callBack, boardId: string) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_BOARD_MISSIONS_STATIONS_URL + `?boardMissionId=${boardId}`, callBack);
}



export {getMoreBoardMissions, updateBoardsMissionsStatusApi, setBoardFiltersApi, getBoardMissionsById, getBoardMissionsActions, updateBoardMissionCurrentStationApi};