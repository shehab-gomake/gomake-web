import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { IProductionFloorFilter } from "@/widgets/production-floor/interfaces/filters";

const GET_PRODUCTION_FLOOR_DATA_URL = "/v1/erp-service/board-missions";
const GET_ALL_STUCK_JOBS_URL =
  "/v1/erp-service/board-missions/get-number-of-stuck-jobs";
const GET_ALL_STUCK_JOBS_BY_AGENT_ID_URL =
  "/v1/erp-service/board-missions/get-number-of-stuck-jobs-by-agent-id";
const UPDATE_WORK_JOB_STATUS_URL =
  "/v1/erp-service/board-missions/update-board-missions-status";
const UPDATE_BOARD_MISSIONS_ORDER_URL =
  "/v1/erp-service/board-missions/update-board-missions-order";
const SET_FILTERS_BOARDS_MISSIONS_URL =
  "/v1/erp-service/board-missions/set-filters";
const GET_BOARDS_MISSIONS_BY_ID_URL =
  "/v1/erp-service/board-missions/board-missions-data/";
const GET_BOARD_MISSIONS_STATIONS_URL =
  "/v1/erp-service/board-missions/board-stations";

const SEND_JOB_EXAMPLE_CONFIRMATION_TO_CLIENT_URL =
  "/v1/erp-service/board-missions/send-job-example-confirmation-to-client";
const UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL =
  "/v1/erp-service/board-missions/update-board-missions-current-station";
  

const UPDATE_BOARD_MISSION_STUCK_REASON_URL =
  "/v1/erp-service/board-missions/update-board-mission-stuck-reason";
const MOVE_BOARD_MISSION_STATUS_TO_WAITING_URL =
  "/v1/erp-service/board-missions/move-board-mission-status-to-waiting";
const ADD_NEW_PRODUCTION_GROUP_URL =
  "/v1/erp-service/board-missions-group/create-group";
const DELETE_PRODUCTION_GROUP_URL =
  "/v1/erp-service/board-missions-group/delete-group/";
const GET_PRINT_HOUSE_ACTIONS_MACHINES_URL =
  "/v1/printhouse-config/actions/get-actions-machines";
const GET_PRINT_HOUSE_ACTIONS_REQUIER_EMPLOYEE_URL =
  "/v1/printhouse-config/actions/get-all-actions-require-employee";
const GET_BOARDS_MISSIONS_GROUPS_URL = "/v1/erp-service/board-missions/groups/";
const GET_BOARDS_MISSIONS_STATIONS_URL =
  "/v1/erp-service/board-missions/board-missions-stations/";
const CANCEL_BOARD_MISSIONS_ACTION_DONE =
  "/v1/erp-service/board-missions-actions/back-to-in-process/";
const UPDATE_BOARD_MISSIONS_ACTION_EMPLOYEE =
  "/v1/erp-service/board-missions-actions/update-action-employee";
const HANDLE_BOARD_MISSIONS_BARCODE_ACTIONS =
  "/v1/erp-service/board-missions-actions/handle-board-missions-barcode-actions";

const HANDLE_BOARD_MISSIONS_BARCODE_ACTIONS_URL =
  "/v1/jobs-service/board-missions-actions/handle-board-missions-qr-actions";

const UPDATE_BOARD_MISSIONS_ACTION_MACHINE =
  "/v1/erp-service/board-missions-actions/update-action-machine";
const TOGGLE_BOARD_MISSIONS_ACTION_TIMER_URL =
  "/v1/erp-service/board-missions-actions/toggle-timer/";
const MOVE_BOARD_MISSION_ACTION_TO_DONE_USING_BARCODE_URL =
  "/v1/erp-service/board-missions-actions/move-board-mission-action-to-done-using-barcode/";

const BOARD_MISSIONS_ADD_NOTE_URL = "/v1/erp-service/board-missions/add-note";
const BOARD_MISSIONS_DELETE_NOTE_URL =
  "/v1/erp-service/board-missions/delete-note";
const GET_BOARD_MISSIONS_ACTIVITIES_URL =
  "/v1/erp-service/board-missions-comments/get-all-comments/";
const ADD_BOARD_MISSIONS_COMMENT_URL =
  "/v1/erp-service/board-missions-comments/add-comment";
const MOVE_BOARD_MISSION_TO_DONE_URL =
  "/v1/erp-service/board-missions/move-board-mission-to-done";

  const MOVE_BOARD_MISSION_LIST_TO_DONE_URL = "/v1/jobs-service/board-missions/move-board-mission-list-to-done" 

  const UPDATE_BOARD_MISSION_LIST_CURRENT_STATION_URL = "/v1/jobs-service/board-missions/update-board-mission-list-current-station"

const BACK_TO_PROCESS_URL = "/v1/erp-service/board-missions/back-to-process";
const SAVE_UPLOADED_FILE_URL =
  "/v1/erp-service/board-missions/save-uploaded-file";
const GET_UPLOADED_FILES_URL =
  "/v1/erp-service/board-missions/get-uploaded-files/";
const GET_UPLOADING_FILES_URL =
  "/v1/erp-service/board-missions/get-uploading-files/";
const GET_BOARD_MISSIONS_ID_BY_QR_CODE_URL =
  "/v1/erp-service/qr-codes/board-missions-id/";
const HANDLE_BOARD_MISSIONS_ID_BY_QR_CODE_URL =
  "/v1/erp-service/qr-codes/handle-board-missions/";
const UPDATE_BOARD_MISSIONS_BY_QR_CODE_URL =
  "/v1/erp-service/qr-codes/update-board-missions";
const CLEAR_FILES_UPLOADER_LIST_URL =
  "/v1/erp-service/board-missions/clear-list";
const UPDATE_PRODUCTION_FLOOR_JOB_COLOR_URL =
  "/v1/erp-service/board-missions/update-production-floor-job-color";
const RESET_PRODUCTION_FLOOR_JOB_COLOR_URL =
  "/v1/erp-service/board-missions/reset-production-floor-job-color";
const GET_BOARD_MISSION_DATA_FOR_MENU_URL =
  "/v1/erp-service/board-missions/get-board-mission-data-for-menu";
const UPDATE_PRINT_HOUSE_MATERIAL_STOCK_FROM_JOB_URL =
  "/v1/erp-service/board-missions-actions/update-print-house-material-stock-from-job";
const GET_PRINT_HOUSE_ACTIONS_URL =
  "/v1/printhouse-config/actions/get-all-actions";

const GET_BOARD_MISSIONS_ACTION_MATERIALS =
  "/v1/erp-service/board-missions-actions/get-board-mission-action-materials/";

const UPDATE_BOARD_MISSIONS_ACTION_DONE_WITH_MATERIALS =
  "/v1/erp-service/board-missions-actions/move-to-done";
const TRY_MOVE_BOARD_MISSION_TO_DONE_URL =
  "/v1/erp-service/board-missions/try-move-board-mission-to-done/";
const UPDATE_DUE_DATE_URL = "/v1/erp-service/board-missions/update-due-date";
const DELETE_JOB_FILE_UR =
  "/v1/erp-service/board-missions/delete-orderitem-file";

const UPDATE_PRODUCTION_FLOOR_NOTE_URL =
  "/v1/erp-service/board-missions/update-production-floor-note";

  const CHECK_IF_CAN_MAKE_GROUPED_BOARD_MISSIONS_URL = "/v1/jobs-service/board-missions/check-if-can-make-grouped-board-missions";
  const CHECK_IF_CAN_MAKE_GROUPED_BOARD_MISSIONS_USING_ORDER_ID_URL = "/v1/jobs-service/board-missions/check-if-can-make-grouped-board-missions-using-order-id";
  const GROUP_JOBS_URL = "/v1/jobs-service/board-missions/group-jobs";
  const GROUP_JOBS_USING_ORDER_ID_URL = "/v1/jobs-service/board-missions/group-jobs-using-order-id";
  const UNGROUP_JOBS_URL = "/v1/jobs-service/board-missions/ungroup-jobs";


const getProductionFloorData: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    connectionId: string;
    filters?: IProductionFloorFilter;
  },
  lock = false,
  abortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRODUCTION_FLOOR_DATA_URL + "?connectionId=" + data.connectionId,
    setState,
    data.filters,
    false,
    abortController
  );
};

const getAllStuckJobsApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_STUCK_JOBS_URL,
    setState
  );
};

const getAllStuckJobsByAgentIdApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_STUCK_JOBS_BY_AGENT_ID_URL,
    setState
  );
};

const updateBoardsMissionsStatusApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardsIds: any[]; statusId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_WORK_JOB_STATUS_URL,
    setState,
    data
  );
};

const updateBoardMissionCurrentStationApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardId: string; stationId: string | null; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_BOARD_MISSIONS_CURRENT_STATION_URL,
    setState,
    {
      boardMissionId: data.boardId,
      newStationId: data.stationId,
      productType: data.productType,
    }
  );
};

const updateBoardMissionStuckReasonApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_BOARD_MISSION_STUCK_REASON_URL,
    setState,
    data
  );
};

const setBoardFiltersApi: ICallAndSetData = async (
  callApi,
  callBack,
  filters: {}
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SET_FILTERS_BOARDS_MISSIONS_URL,
    callBack,
    filters
  );
};

const getBoardMissionsById: ICallAndSetData = async (
  callApi,
  callBack,
  { id, productType },
  lock = false,
  abortController
) => {
  const url = `${GET_BOARDS_MISSIONS_BY_ID_URL}${id}?productType=${productType}`;

  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    url,
    callBack,
    {},
    lock,
    abortController
  );
};

const getBoardMissionsActions: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSIONS_STATIONS_URL +
      `?boardMissionId=${data.boardMissionId}&productType=${data.productType}`,
    callBack
  );
};

const moveBoardMissionStatusToWaitingApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    MOVE_BOARD_MISSION_STATUS_TO_WAITING_URL,
    callBack,
    data
  );
};

const sendJobExampleConfirmationToClientApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    SEND_JOB_EXAMPLE_CONFIRMATION_TO_CLIENT_URL +
      `?boardMissionId=${data.boardMissionId}`,
    callBack
  );
};

const addNewBoardMissionsGroup: ICallAndSetData = async (
  callApi,
  callBack,
  group
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_NEW_PRODUCTION_GROUP_URL,
    callBack,
    group
  );
};

const deleteBoardMissionsGroup: ICallAndSetData = async (
  callApi,
  callBack,
  groupId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_PRODUCTION_GROUP_URL + groupId,
    callBack
  );
};

const getPrintHouseActions: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_ACTIONS_MACHINES_URL + "?isFromEmployeeForm=" + data,
    callBack
  );
};

const getAllActionsRequireEmployeeApi: ICallAndSetData = async (
  callApi,
  callBack
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_ACTIONS_REQUIER_EMPLOYEE_URL,
    callBack
  );
};

const getBoardsMissionsGroupsByID: ICallAndSetData = async (
  callApi,
  callBack,
  groupId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARDS_MISSIONS_GROUPS_URL + groupId,
    callBack
  );
};

const getBoardsMissionsStations: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionsId: string; productType: string },
  lock = false,
  abortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARDS_MISSIONS_STATIONS_URL +
      data.boardMissionsId +
      (data.productType ? "?productType=" + data.productType : ""),
    callBack,
    {},
    lock,
    abortController
  );
};

const cancelBoardMissionsActionDone: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionsActionId: string; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CANCEL_BOARD_MISSIONS_ACTION_DONE +
      data.boardMissionsActionId +
      (data.productType ? "?productType=" + data.productType : ""),
    callBack
  );
};

const toggleBoardMissionsActionTimer: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionsActionId: string; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    TOGGLE_BOARD_MISSIONS_ACTION_TIMER_URL +
      data.boardMissionsActionId +
      (data.productType ? "?productType=" + data.productType : ""),
    callBack
  );
};

const moveBoardMissionActionToDoneUsingBarcodeApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string; productType: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    MOVE_BOARD_MISSION_ACTION_TO_DONE_USING_BARCODE_URL +
      data.boardMissionId +
      (data.productType ? "?productType=" + data.productType : ""),
    callBack
  );
};

const boardMissionsAddNote: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    BOARD_MISSIONS_ADD_NOTE_URL,
    callBack,
    data
  );
};

const boardMissionsDeleteNote: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    BOARD_MISSIONS_DELETE_NOTE_URL,
    callBack,
    data
  );
};

const getAllBoardMissionsActivities: ICallAndSetData = async (
  callApi,
  callBack,
  boardMissionsId: string,
  lock = false,
  abortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSIONS_ACTIVITIES_URL + boardMissionsId,
    callBack,
    {},
    lock,
    abortController
  );
};

const addBoardMissionsComment: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_BOARD_MISSIONS_COMMENT_URL,
    callBack,
    data
  );
};

const saveUploadedFile: ICallAndSetData = async (callApi, callBack, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_UPLOADED_FILE_URL,
    callBack,
    data
  );
};

const getAllBoardMissionsUploadedFiles: ICallAndSetData = async (
  callApi,
  callBack,
  orderItemId: string,
  lock = false,
  abortController: AbortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_UPLOADED_FILES_URL + orderItemId,
    callBack,
    {},
    lock,
    abortController
  );
};

const getAllBoardMissionsUploadingFiles: ICallAndSetData = async (
  callApi,
  callBack,
  connectionID: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_UPLOADING_FILES_URL + connectionID,
    callBack
  );
};

const moveBoardMissionToDoneApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardMissionId: string; sendMessage?: string; productType?: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    MOVE_BOARD_MISSION_TO_DONE_URL,
    setState,
    data
  );
};

const moveBoardMissionListToDoneApi: ICallAndSetData = async (  
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    MOVE_BOARD_MISSION_LIST_TO_DONE_URL,
    setState,
    data
  );
};

const updateBoardMissionListCurrentStationApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_BOARD_MISSION_LIST_CURRENT_STATION_URL,
    setState,
    data
  );
};

const backToProcessApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardMissionId: string; sendMessage?: string; productType?: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    BACK_TO_PROCESS_URL,
    setState,
    data
  );
};

const updateBoardsMissionsOrderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_BOARD_MISSIONS_ORDER_URL,
    setState,
    data
  );
};

const getBoardMissionsIdByQrCodeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSIONS_ID_BY_QR_CODE_URL + data,
    setState
  );
};

const handleBoardMissionsQrCodeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    HANDLE_BOARD_MISSIONS_ID_BY_QR_CODE_URL + data,
    setState
  );
};

const updateBoardMissionsQrCodeApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_BOARD_MISSIONS_BY_QR_CODE_URL,
    setState,
    data
  );
};

const boardMissionsUpdateActionEmployee: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_BOARD_MISSIONS_ACTION_EMPLOYEE,
    callBack,
    data
  );
};

const handleBoardMissionsBarcodeActions: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    HANDLE_BOARD_MISSIONS_BARCODE_ACTIONS,
    callBack,
    data
  );
};

const boardMissionsUpdateActionMachine: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_BOARD_MISSIONS_ACTION_MACHINE,
    callBack,
    data
  );
};

const clearUploadingFilesListApi: ICallAndSetData = async (
  callApi,
  callBack
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    CLEAR_FILES_UPLOADER_LIST_URL,
    callBack
  );
};

const updateProductionFloorJobColorApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string; productionFloorJobColor: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PRODUCTION_FLOOR_JOB_COLOR_URL,
    callBack,
    data
  );
};

const resetProductionFloorJobColorApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    RESET_PRODUCTION_FLOOR_JOB_COLOR_URL,
    callBack,
    data
  );
};

const getBoardMissionDataForMenuApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { boardMissionId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSION_DATA_FOR_MENU_URL,
    callBack,
    data
  );
};

const updatePrintHouseMaterialStockFromJobApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    currentStationId: string;
    boardMissionActionId: string;
    productionTime: number;
    materials: Array<{
      productType: string;
      workFlowActionId: string;
      materialKey: string;
      currentValue: number;
    }>;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PRINT_HOUSE_MATERIAL_STOCK_FROM_JOB_URL,
    callBack,
    data
  );
};

const getAllActionsApi: ICallAndSetData = async (callApi, callBack, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_ACTIONS_URL,
    callBack,
    data
  );
};

const getBoardMissionActionMaterialsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    boardMissionsActionId: string;
    productType: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSIONS_ACTION_MATERIALS +
      data.boardMissionsActionId +
      (data.productType ? "?productType=" + data.productType : ""),
    callBack,
    {},
    true,
    null,
    true
  );
};

const updateBoardMissionsActionDoneWithMaterialsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    currentStationId: string;
    boardMissionActionId: string;
    productionTime: number;
    materials: Array<{
      productType: string;
      workFlowActionId: string;
      materialKey: string;
      currentValue: number;
    }>;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_BOARD_MISSIONS_ACTION_DONE_WITH_MATERIALS,
    callBack,
    data
  );
};

const tryMoveBoardMissionToDoneApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardMissionId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    TRY_MOVE_BOARD_MISSION_TO_DONE_URL + data.boardMissionId,
    setState
  );
};
const updateJobDueDateApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    boardMissionId: string;
    dueDate: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DUE_DATE_URL,
    callBack,
    data
  );
};
const deleteJobFileApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    orderItemId: string;
    filename: string;
    source: string;
    productType: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DELETE_JOB_FILE_UR,
    callBack,
    data
  );
};
const updateProductionFloorNotesApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    boardMissionId: string;
    productType: string;
    note: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_PRODUCTION_FLOOR_NOTE_URL,
    callBack,
    data
  );
};

const handleBoardMissionsBarcodeActionsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    HANDLE_BOARD_MISSIONS_BARCODE_ACTIONS_URL,
    callBack,
    data
  );
};

const checkIfCanMakeGroupedBoardMissionsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi, 
    EHttpMethod.POST, 
    CHECK_IF_CAN_MAKE_GROUPED_BOARD_MISSIONS_URL, 
    callBack, 
    data
  );
};

// 2. Check If Can Make Grouped Board Missions Using Order Id
const checkIfCanMakeGroupedBoardMissionsUsingOrderIdApi: ICallAndSetData = async (
  callApi,
  callBack,
  orderId
) => {
  return await getSetApiData(
    callApi, 
    EHttpMethod.GET, 
    `${CHECK_IF_CAN_MAKE_GROUPED_BOARD_MISSIONS_USING_ORDER_ID_URL}/${orderId}`, 
    callBack
  );
};

// 3. Group Jobs
const groupJobsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi, 
    EHttpMethod.POST, 
    GROUP_JOBS_URL, 
    callBack, 
    data
  );
};

// 4. Get Group Jobs Using Order Id
const getGroupJobsUsingOrderIdApi: ICallAndSetData = async (
  callApi,
  callBack,
  orderId
) => {
  return await getSetApiData(
    callApi, 
    EHttpMethod.GET, 
    `${GROUP_JOBS_USING_ORDER_ID_URL}/${orderId}`, 
    callBack
  );
};

// 5. Ungroup Jobs
const ungroupJobsApi: ICallAndSetData = async (
  callApi,
  callBack,
  groupId
) => {
  return await getSetApiData(
    callApi, 
    EHttpMethod.DELETE, 
    `${UNGROUP_JOBS_URL}/${groupId}`, 
    callBack
  );
};

export {
  boardMissionsUpdateActionEmployee,
  handleBoardMissionsBarcodeActions,
  boardMissionsUpdateActionMachine,
  getProductionFloorData,
  updateBoardsMissionsStatusApi,
  setBoardFiltersApi,
  getBoardMissionsById,
  getBoardMissionsActions,
  updateBoardMissionCurrentStationApi,
  updateBoardMissionStuckReasonApi,
  moveBoardMissionStatusToWaitingApi,
  addNewBoardMissionsGroup,
  deleteBoardMissionsGroup,
  getPrintHouseActions,
  getAllActionsRequireEmployeeApi,
  getBoardsMissionsGroupsByID,
  getBoardsMissionsStations,
  cancelBoardMissionsActionDone,
  toggleBoardMissionsActionTimer,
  moveBoardMissionActionToDoneUsingBarcodeApi,
  boardMissionsAddNote,
  boardMissionsDeleteNote,
  getAllBoardMissionsActivities,
  addBoardMissionsComment,
  moveBoardMissionToDoneApi,
  moveBoardMissionListToDoneApi,
  updateBoardMissionListCurrentStationApi,
  backToProcessApi,
  saveUploadedFile,
  getAllBoardMissionsUploadedFiles,
  getAllBoardMissionsUploadingFiles,
  updateBoardsMissionsOrderApi,
  getBoardMissionsIdByQrCodeApi,
  handleBoardMissionsQrCodeApi,
  updateBoardMissionsQrCodeApi,
  clearUploadingFilesListApi,
  updateProductionFloorJobColorApi,
  resetProductionFloorJobColorApi,
  getBoardMissionDataForMenuApi,
  updatePrintHouseMaterialStockFromJobApi,
  getAllActionsApi,
  getBoardMissionActionMaterialsApi,
  updateBoardMissionsActionDoneWithMaterialsApi,
  tryMoveBoardMissionToDoneApi,
  updateJobDueDateApi,
  deleteJobFileApi,
  updateProductionFloorNotesApi,
  sendJobExampleConfirmationToClientApi,
  getAllStuckJobsApi,
  getAllStuckJobsByAgentIdApi,
  handleBoardMissionsBarcodeActionsApi,
  checkIfCanMakeGroupedBoardMissionsApi,
  checkIfCanMakeGroupedBoardMissionsUsingOrderIdApi,
  groupJobsApi,
  getGroupJobsUsingOrderIdApi,
  ungroupJobsApi
};
