import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const GET_ALL_PRINT_HOUSES_REPORTS_URL = '/v1/printhouses/get-print-houses-report';

const getAllDataPrintHousesReports: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_ALL_PRINT_HOUSES_REPORTS_URL,
      setState,
    );
  };
  export {getAllDataPrintHousesReports};