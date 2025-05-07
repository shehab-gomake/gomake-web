import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { BoardMissionFilters } from "@/pages-components/board-missions/widgets/interfaces";

const ADD_PRINT_HOUSE_JOBS_STORAGE_URL = "/v1/erp-service/add-print-house-jobs-storage";

const GET_ALL_PRINT_HOUSE_JOBS_STORAGE_URL = "/v1/erp-service/get-all-print-house-jobs-storage";

const addPrintHouseJobsStorageApi: ICallAndSetData = async (
  callApi,
  setState,
  data: BoardMissionFilters
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_PRINT_HOUSE_JOBS_STORAGE_URL,
    setState,
    data
  );
};



const getAllPrintHouseJobsStorageApi: ICallAndSetData = async (
  callApi,
  setState,
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PRINT_HOUSE_JOBS_STORAGE_URL,
    setState,
  );
};


export {
  addPrintHouseJobsStorageApi,
  getAllPrintHouseJobsStorageApi,
};
