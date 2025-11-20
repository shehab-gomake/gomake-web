import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const ADD_UPDATE_LIST_URL = "/v1/jobs-service/job-time-alerts/add-update-list";
const DELETE_STEP_URL = "/v1/jobs-service/job-time-alerts/delete-step";
const UPDATE_STEP_URL = "/v1/jobs-service/job-time-alerts/update-step";
const GET_JOB_TIME_ALERT_STEP_URL =
  "/v1/jobs-service/job-time-alerts/get-job-time-alert-step";

const addUpdateListApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_UPDATE_LIST_URL,
    setState,
    data
  );
};

const deleteStepApi: ICallAndSetData = async (
  callApi,
  setState,
  id: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${DELETE_STEP_URL}/${id}`,
    setState
  );
};

const updateStepApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { id: string; [key: string]: any }
) => {
  const { id, ...updateData } = data;
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UPDATE_STEP_URL}/${id}`,
    setState,
    updateData
  );
};

const getJobTimeAlertStepApi: ICallAndSetData = async (
  callApi,
  setState,
  data?
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_JOB_TIME_ALERT_STEP_URL,
    setState,
    data
  );
};

export {
  addUpdateListApi,
  deleteStepApi,
  updateStepApi,
  getJobTimeAlertStepApi,
};
