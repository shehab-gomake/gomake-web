import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const SEND_PAYMENT_PAGE_URL = "/v1/printHouses/send-payment-page";
const GET_ALL_PRINT_HOUSES_REPORTS_URL =
  "/v1/printhouses/get-print-houses-report";
const GET_PRINT_HOUSE_PAYMENTS_HISTORY_URL =
  "/v1/printhouses/get-print-house-payments-history/";
const CREATE_PRINT_HOUSE_IN_ACCOUNTING_URL =
  "/v1/admin/print-houses/create-print-house-in-accounting";

const getAllDataPrintHousesReports: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_PRINT_HOUSES_REPORTS_URL,
    setState
  );
};

const sendPaymentPageApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_PAYMENT_PAGE_URL,
    setState,
    data,
    true
  );
};

const getPrintHousePaymentsHistory: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINT_HOUSE_PAYMENTS_HISTORY_URL + data,
    setState
  );
};

const createPrintHouseInAccountingApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_PRINT_HOUSE_IN_ACCOUNTING_URL,
    setState,
    data,
    true
  );
};

export {
  getAllDataPrintHousesReports,
  getPrintHousePaymentsHistory,
  sendPaymentPageApi,
  createPrintHouseInAccountingApi,
};
