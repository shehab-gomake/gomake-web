import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const GET_ALL_PRINT_HOUSES_REPORTS_URL = '/v1/printhouses/get-print-houses-report';
const GET_PRINT_HOUSE_PAYMENTS_HISTORY_URL = '/v1/printhouses/get-print-house-payments-history/';

const getAllDataPrintHousesReports: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      GET_ALL_PRINT_HOUSES_REPORTS_URL,
      setState,
    );
  };
const getPrintHousePaymentsHistory: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
        GET_PRINT_HOUSE_PAYMENTS_HISTORY_URL + data,
      setState,
    );
  };
  export {getAllDataPrintHousesReports, getPrintHousePaymentsHistory};