import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { IReschedulingRequest } from "@/interfaces";

const GET_TIME_LINE_JOBS_URL =
  "/v1/erp-service/job-time-line/get-jobs-time-line-by-date";
const UPDATE_JOB_TIME_URL = "/v1/erp-service/job-time-line/update-job-time";
const RESCHEDULE_ACTIONS_URL =
  "/v1/timeline-service/job-rescheduling/reschedule-actions";

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
  data: IReschedulingRequest
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    RESCHEDULE_ACTIONS_URL,
    setState,
    data
  );
};

export { getTimeLineJobsApi, updateJobTimeApi, rescheduleActionsApi };
