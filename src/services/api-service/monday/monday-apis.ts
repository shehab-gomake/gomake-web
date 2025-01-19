import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const CREATE_MONDAY_TASK_URL = "/v1/monday-service/monday/create-task";

const createMondayTaskApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_MONDAY_TASK_URL,
    setState,
    data
  );
};

export { createMondayTaskApi };
