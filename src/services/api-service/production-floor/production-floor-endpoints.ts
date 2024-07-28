import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_PRODUCTION_FLOOR_DATA_URL = '/v1/erp-service/board-missions';
const UPDATE_WORK_JOB_STATUS_URL = '/v1/erp-service/board-missions/update-board-missions-status';
const UPDATE_BOARD_MISSIONS_ORDER_URL = '/v1/erp-service/board-missions/update-board-missions-order';
const SET_FILTERS_BOARDS_MISSIONS_URL = '/v1/erp-service/board-missions/set-filters';
const GET_BOARDS_MISSIONS_BY_ID_URL = '/v1/erp-service/board-missions/board-missions-data/';
const GET_BOARD_MISSIONS_STATIONS_URL = '/v1/erp-service/board-missions/board-stations';
const UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL = '/v1/erp-service/board-missions/update-board-missions-current-station';
const ADD_NEW_PRODUCTION_GROUP_URL = '/v1/erp-service/board-missions-group/create-group';
const DELETE_PRODUCTION_GROUP_URL = '/v1/erp-service/board-missions-group/delete-group/';
const GET_PRINT_HOUSE_ACTIONS_MACHINES_URL = '/v1/printhouse-config/actions/get-actions-machines';
const GET_PRINT_HOUSE_ACTIONS_REQUIER_EMPLOYEE_URL = '/v1/printhouse-config/actions/get-all-actions-require-employee';

const GET_BOARDS_MISSIONS_GROUPS_URL = '/v1/erp-service/board-missions/groups/';
const GET_BOARDS_MISSIONS_STATIONS_URL = '/v1/erp-service/board-missions/board-missions-stations/';
const UPDATE_BOARD_MISSIONS_ACTION_DONE = '/v1/erp-service/board-missions-actions/move-to-done/';
const CANCEL_BOARD_MISSIONS_ACTION_DONE = '/v1/erp-service/board-missions-actions/back-to-in-process/';
const TOGGLE_BOARD_MISSIONS_ACTION_TIMER_URL = '/v1/erp-service/board-missions-actions/toggle-timer/';
const BOARD_MISSIONS_ADD_NOTE_URL = '/v1/erp-service/board-missions/add-note';
const BOARD_MISSIONS_DELETE_NOTE_URL = '/v1/erp-service/board-missions/delete-note';
const GET_BOARD_MISSIONS_ACTIVITIES_URL = '/v1/erp-service/board-missions-comments/get-all-comments/';
const ADD_BOARD_MISSIONS_COMMENT_URL = '/v1/erp-service/board-missions-comments/add-comment';
const MOVE_BOARD_MISSION_TO_DONE_URL = '/v1/erp-service/board-missions/move-board-mission-to-done';
const BACK_TO_PROCESS_URL = '/v1/erp-service/board-missions/back-to-process';
const SAVE_UPLOADED_FILE_URL = '/v1/erp-service/board-missions/save-uploaded-file';
const GET_UPLOADED_FILES_URL = '/v1/erp-service/board-missions/get-uploaded-files/';
const GET_UPLOADING_FILES_URL = '/v1/erp-service/board-missions/get-uploading-files/';
const GET_BOARD_MISSIONS_ID_BY_QR_CODE_URL = '/v1/erp-service/qr-codes/board-missions-id/';
const HANDLE_BOARD_MISSIONS_ID_BY_QR_CODE_URL = '/v1/erp-service/qr-codes/handle-board-missions/';
const UPDATE_BOARD_MISSIONS_BY_QR_CODE_URL = '/v1/erp-service/qr-codes/update-board-missions';


const getProductionFloorData: ICallAndSetData = async (callApi, setState, connectionId: string, lock = false, abortController) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRODUCTION_FLOOR_DATA_URL + '?connectionId=' + connectionId, setState, {}, false, abortController);
};


const updateBoardsMissionsStatusApi: ICallAndSetData = async (callApi, setState, data: { boardsIds: any[], statusId: string}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_WORK_JOB_STATUS_URL, setState, data);
};

const updateBoardMissionCurrentStationApi: ICallAndSetData = async (callApi, setState, data: { boardId: string, stationId: string | null, productType: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL, setState, {boardMissionId: data.boardId, newStationId: data.stationId, productType: data.productType});
};

const setBoardFiltersApi: ICallAndSetData = async (callApi, callBack, filters: {}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SET_FILTERS_BOARDS_MISSIONS_URL, callBack, filters);
}
const getBoardMissionsById: ICallAndSetData = async (callApi, callBack, {id, connectionId, productType}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_BY_ID_URL + id + '/' + connectionId + '?productType=' + productType, callBack);
}
const getBoardMissionsActions: ICallAndSetData = async (callApi, callBack, data: {boardMissionId: string, productType: string}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARD_MISSIONS_STATIONS_URL + `?boardMissionId=${data.boardMissionId}&productType=${data.productType}`, callBack);
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
const getAllActionsRequireEmployeeApi: ICallAndSetData = async (callApi, callBack, ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRINT_HOUSE_ACTIONS_REQUIER_EMPLOYEE_URL , callBack);
}
const getBoardsMissionsGroupsByID: ICallAndSetData = async (callApi, callBack, groupId: string ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_GROUPS_URL + groupId , callBack);
}
const getBoardsMissionsStations: ICallAndSetData = async (callApi, callBack, data: {boardMissionsId: string; productType: string} ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARDS_MISSIONS_STATIONS_URL + data.boardMissionsId + `${data.productType ? '?productType=' + data.productType : ''}` , callBack);
}
const updateBoardMissionsActionDone: ICallAndSetData = async (callApi, callBack, data: {boardMissionsActionId: string; productType: string; isSendMessage: boolean} ) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_BOARD_MISSIONS_ACTION_DONE + data.boardMissionsActionId  + '?isSendMessage=' + !!data.isSendMessage +`${data.productType ? '&productType=' + data.productType : ''}` , callBack);
}
const cancelBoardMissionsActionDone: ICallAndSetData = async (callApi, callBack, data: {boardMissionsActionId: string; productType: string} ) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, CANCEL_BOARD_MISSIONS_ACTION_DONE + data.boardMissionsActionId + `${data.productType ? '?productType=' + data.productType : ''}` , callBack);
}
const toggleBoardMissionsActionTimer: ICallAndSetData = async (callApi, callBack, data: {boardMissionsActionId: string; productType: string} ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, TOGGLE_BOARD_MISSIONS_ACTION_TIMER_URL + data.boardMissionsActionId +`${data.productType ? '?productType=' + data.productType : ''}`, callBack);
}

const boardMissionsAddNote: ICallAndSetData = async (callApi, callBack, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, BOARD_MISSIONS_ADD_NOTE_URL , callBack, data);
}
const boardMissionsDeleteNote: ICallAndSetData = async (callApi, callBack, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, BOARD_MISSIONS_DELETE_NOTE_URL , callBack, data);
}

const getAllBoardMissionsActivities: ICallAndSetData = async (callApi, callBack, boardMissionsId: string ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARD_MISSIONS_ACTIVITIES_URL + boardMissionsId , callBack);
}
const addBoardMissionsComment: ICallAndSetData = async (callApi, callBack, data ) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_BOARD_MISSIONS_COMMENT_URL , callBack, data);
}
const saveUploadedFile: ICallAndSetData = async (callApi, callBack, data ) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SAVE_UPLOADED_FILE_URL , callBack, data);
}

const getAllBoardMissionsUploadedFiles: ICallAndSetData = async (callApi, callBack, orderItemId: string ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_UPLOADED_FILES_URL + orderItemId , callBack);
}
const getAllBoardMissionsUploadingFiles: ICallAndSetData = async (callApi, callBack, connectionID: string ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_UPLOADING_FILES_URL + connectionID , callBack);
}

const moveBoardMissionToDoneApi: ICallAndSetData = async (callApi, setState, data: { boardMissionId: string, sendMessage?: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, MOVE_BOARD_MISSION_TO_DONE_URL, setState, data);
};

const backToProcessApi: ICallAndSetData = async (callApi, setState, data: { boardMissionId: string, sendMessage?: string }) => {
    return await getSetApiData(callApi, EHttpMethod.POST, BACK_TO_PROCESS_URL, setState, data);
};

const updateBoardsMissionsOrderApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_BOARD_MISSIONS_ORDER_URL, setState, data);
};
const getBoardMissionsIdByQrCodeApi: ICallAndSetData = async (callApi, setState, data: string) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_BOARD_MISSIONS_ID_BY_QR_CODE_URL + data, setState);
};
const handleBoardMissionsQrCodeApi: ICallAndSetData = async (callApi, setState, data: string) => {
    return await getSetApiData(callApi, EHttpMethod.GET, HANDLE_BOARD_MISSIONS_ID_BY_QR_CODE_URL + data, setState);
};

const updateBoardMissionsQrCodeApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_BOARD_MISSIONS_BY_QR_CODE_URL, setState, data);
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
    getAllActionsRequireEmployeeApi,
    getBoardsMissionsGroupsByID,
    getBoardsMissionsStations,
    updateBoardMissionsActionDone,
    cancelBoardMissionsActionDone,
    toggleBoardMissionsActionTimer,
    boardMissionsAddNote,
    boardMissionsDeleteNote,
    getAllBoardMissionsActivities,
    addBoardMissionsComment,
    moveBoardMissionToDoneApi,
    backToProcessApi,
    saveUploadedFile,
    getAllBoardMissionsUploadedFiles,
    getAllBoardMissionsUploadingFiles,
    updateBoardsMissionsOrderApi,
    getBoardMissionsIdByQrCodeApi,
    handleBoardMissionsQrCodeApi,
    updateBoardMissionsQrCodeApi
}