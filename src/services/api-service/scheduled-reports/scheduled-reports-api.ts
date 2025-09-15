import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const CREATE_SCHEDULED_REPORT_URL = "/v1/scheduled-reports-service/api/creating-scheduled-reports";
const UPDATE_SCHEDULED_REPORT_URL = "/v1/scheduled-reports-service/api/updating-scheduled-reports";
const GET_ALL_SCHEDULED_REPORTS_URL = "/v1/scheduled-reports-service/api/getting-all-scheduled-reports";
const DELETE_SCHEDULED_REPORT_URL = "/v1/scheduled-reports-service/api/deleting-scheduled-reports";
const TOGGLE_SCHEDULED_REPORT_URL = "/v1/scheduled-reports-service/api/toggling-scheduled-reports";
const GET_SCHEDULED_REPORT_BY_ID_URL = "/v1/scheduled-reports-service/api/getting-scheduled-report-by-id";
const RUN_SCHEDULED_REPORT_URL = "/v1/scheduled-reports-service/api/running-scheduled-reports";
const GET_ACTIVE_DUE_SCHEDULED_REPORTS_URL = "/v1/scheduled-reports-service/api/getting-active-due-scheduled-reports/active/due";

const createScheduledReportApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_SCHEDULED_REPORT_URL,
    setState,
    data
  );
};

const updateScheduledReportApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_SCHEDULED_REPORT_URL,
    setState,
    data
  );
};

const getAllScheduledReportsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_SCHEDULED_REPORTS_URL,
    setState,
    data
  );
};

const deleteScheduledReportApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { id: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${DELETE_SCHEDULED_REPORT_URL}/${data.id}`,
    setState,
    data
  );
};

const toggleScheduledReportApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { id: string; isActive: boolean }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${TOGGLE_SCHEDULED_REPORT_URL}/${data.id}/toggle?isActive=${data.isActive}`,
    setState,
    {} // Empty body
  );
};

const getScheduledReportByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { id: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_SCHEDULED_REPORT_BY_ID_URL}/${data.id}`,
    setState,
    data
  );
};

const runScheduledReportApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { id: string; [key: string]: any }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    `${RUN_SCHEDULED_REPORT_URL}/${data.id}/run`,
    setState,
    data
  );
};

const getActiveDueScheduledReportsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ACTIVE_DUE_SCHEDULED_REPORTS_URL,
    setState,
    data
  );
};

export {
  createScheduledReportApi,
  updateScheduledReportApi,
  getAllScheduledReportsApi,
  deleteScheduledReportApi,
  toggleScheduledReportApi,
  getScheduledReportByIdApi,
  runScheduledReportApi,
  getActiveDueScheduledReportsApi,
};