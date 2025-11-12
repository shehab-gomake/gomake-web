import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { BoardMissionFilters } from "@/pages-components/board-missions/widgets/interfaces";

const SET_BOARD_MISSION_FILTER_URL =
  "/v1/erp-service/board-missions-tables/set-table-filters";
const GET_ALL_PURCHASE_JOBS_URL =
  "/v1/erp-service/board-missions-tables/get-all-purchase-jobs";
const GET_ORDER_SUMMERY_PDF_URL =
  "/v1/erp-service/orders/get-order-summery-pdf";
const GET_WORK_MISSION_PDF_URL =
  "/v1/erp-service/board-missions-tables/get-work-mission-pdf";
const GET_DELIVERY_TICKER_PDF_URL =
  "/v1/erp-service/board-missions-tables/get-delivery-ticker-pdf";
const PRINT_DELIVERY_TICKER_PDF_URL =
  "/v1/erp-service/board-missions-tables/print-delivery-ticker-pdf";
const CHECK_IF_PRODUCT_IS_LABEL_IN_ROLLS_URL =
  "/v1/erp-service/board-missions/check-if-product-is-label-in-rolls";
const ADD_BOARD_MISSIONS_TO_FILE_UPLOADER_URL =
  "/v1/erp-service/board-missions/add-to-file-uploader";
const PRINT_JOB_USING_PRINT_NODE_URL =
  "/v1/erp-service/board-missions-tables/print-job-using-print-node/";
const PRINT_ODER_JOBS_USING_PRINT_NODE_URL =
  "/v1/erp-service/board-missions-tables/print-order-jobs-using-print-node/";
const SEARCH_JOBS_URL = "/v1/erp-service/board-missions/search-jobs";
const ADD_ORDER_BOARD_MISSIONS_TO_FILE_UPLOADER_URL =
  "/v1/erp-service/board-missions/add-order-to-file-uploader";
const EXPORT_JOBS_TABLE_TO_EXCEL_URL =
  "/v1/job-service/board-missions-tables/export-job-table-to-excel";
const EXPORT_JOBS_TABLE_TO_EXCEL_ASYNC_URL =
  "/v1/job-service/board-missions-tables/export-job-table-to-excel-async";
const EXPORT_PURCHASE_JOB_TABLE_TO_EXCEL_URL =
  "/v1/erp-service/board-missions-tables/export-purchase-job-table-to-excel";
const PRINT_NODE_PRINTING_MODAL_LOG =
  "/v1/job-service/board-missions-tables/print-node-modal-log";
const PRINT_NODE_PRINTING_CANCEL_LOG =
  "/v1/job-service/board-missions-tables/print-node-cancel-log";
const GET_INITIAL_ORDER_FOLDERS_DATA =
  "/v1/job-service/board-missions-tables/get-initial-order-folders-data";
const SAVE_JOBS_TABLE_SETTINGS_URL =
  "/v1/job-service/production-floor-table-settings/save-jobs-table-settings";
const GET_JOBS_TABLE_SETTINGS_URL =
  "/v1/job-service/production-floor-table-settings/get-jobs-table-settings";

const setBoardMissionsFiltersApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SET_BOARD_MISSION_FILTER_URL,
    setState,
    data
  );
};

const getAllPurchaseJobsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_PURCHASE_JOBS_URL,
    setState,
    data
  );
};

const getOrderSummeryPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ORDER_SUMMERY_PDF_URL,
    setState,
    data
  );
};

const getWorkMissionPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_WORK_MISSION_PDF_URL,
    setState,
    data
  );
};

const getDeliveryTickerPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_DELIVERY_TICKER_PDF_URL,
    setState,
    data
  );
};
const printDeliveryTickerPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_DELIVERY_TICKER_PDF_URL,
    setState,
    data
  );
};
const addBoardMissionsToFileUploaderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_BOARD_MISSIONS_TO_FILE_UPLOADER_URL,
    setState,
    data
  );
};
const printJobUsingPrintNodeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    PRINT_JOB_USING_PRINT_NODE_URL + data,
    setState
  );
};
const printOrderJobUsingPrintNodeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    PRINT_ODER_JOBS_USING_PRINT_NODE_URL + data,
    setState
  );
};

const searchJobsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    SEARCH_JOBS_URL,
    setState,
    data
  );
};

const addOrderBoardMissionsToFileUploaderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_ORDER_BOARD_MISSIONS_TO_FILE_UPLOADER_URL,
    setState,
    data
  );
};

const exportJobTableToExcelApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_JOBS_TABLE_TO_EXCEL_URL,
    setState,
    data
  );
};

const exportJobTableToExcelAsyncApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters & { email: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_JOBS_TABLE_TO_EXCEL_ASYNC_URL,
    setState,
    data
  );
};

const exportPurchaseJobTableToExcelApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_PURCHASE_JOB_TABLE_TO_EXCEL_URL,
    setState,
    data
  );
};

const printNodeModalShowLog: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_NODE_PRINTING_MODAL_LOG,
    setState,
    data
  );
};
const printNodeModalCancelLog: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_NODE_PRINTING_CANCEL_LOG,
    setState,
    data
  );
};
const getInitialOrderFoldersData: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_INITIAL_ORDER_FOLDERS_DATA,
    setState,
    data
  );
};

const saveJobsTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_JOBS_TABLE_SETTINGS_URL,
    setState,
    data
  );
};

const getJobsTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_JOBS_TABLE_SETTINGS_URL,
    setState,
    data
  );
};

const checkIfProductIsLabelInRollsApi: ICallAndSetData = async (
  callApi,
  setState,
  boardMissionId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${CHECK_IF_PRODUCT_IS_LABEL_IN_ROLLS_URL}/${boardMissionId}`,
    setState
  );
};

export {
  setBoardMissionsFiltersApi,
  getOrderSummeryPdfApi,
  getWorkMissionPdfApi,
  getDeliveryTickerPdfApi,
  printDeliveryTickerPdfApi,
  getAllPurchaseJobsApi,
  addBoardMissionsToFileUploaderApi,
  printJobUsingPrintNodeApi,
  printOrderJobUsingPrintNodeApi,
  searchJobsApi,
  addOrderBoardMissionsToFileUploaderApi,
  exportJobTableToExcelApi,
  exportJobTableToExcelAsyncApi,
  exportPurchaseJobTableToExcelApi,
  printNodeModalShowLog,
  printNodeModalCancelLog,
  getInitialOrderFoldersData,
  saveJobsTableSettingsApi,
  getJobsTableSettingsApi,
  checkIfProductIsLabelInRollsApi,
};
