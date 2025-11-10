import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { IReschedulingAction } from "@/interfaces";

const GET_TIME_LINE_JOBS_URL =
  "/v1/erp-service/job-time-line/get-jobs-time-line-by-date";
const UPDATE_JOB_TIME_URL = "/v1/erp-service/job-time-line/update-job-time";
const RESCHEDULE_ACTIONS_URL =
  "/v1/timeline-service/job-rescheduling/process-reschedule";
const RECOVER_OVERDUE_URL =
  "/v1/timeline-service/job-rescheduling/recover-overdue";
const RESTORE_OLD_BOARD_URL =
  "/v1/timeline-service/job-rescheduling/restore-old-board";

const getTimeLineJobsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_TIME_LINE_JOBS_URL,
    setState,
    data
  );
};

const updateJobTimeApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_JOB_TIME_URL,
    setState,
    data
  );
};

const rescheduleActionsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: IReschedulingAction[]
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    RESCHEDULE_ACTIONS_URL,
    setState,
    data
  );
};

const recoverOverdueApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    RECOVER_OVERDUE_URL,
    setState
  );
};

const restoreOldBoardApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    RESTORE_OLD_BOARD_URL,
    setState
  );
};

export {
  getTimeLineJobsApi,
  updateJobTimeApi,
  rescheduleActionsApi,
  recoverOverdueApi,
  restoreOldBoardApi,
};
