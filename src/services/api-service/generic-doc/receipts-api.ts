import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_CLIENT_PAYMENT_ITEMS_URL = "/v1/erp-service/receipts/get-new-receipt";
const GET_ERP_ACCOUNTS_URL = "/v1/erp-service/receipts/get-ERP-accounts";
const CREATE_RECEIPT_URL = "/v1/erp-service/receipts/create-receipt";
const GET_ALL_RECEIPTS_URL = "/v1/erp-service/receipts/get-all-receipts";
const GET_RECEIPT_BY_ID_URL = "/v1/erp-service/receipts/get-receipt-by-id";

const getClientPaymentItemsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CLIENT_PAYMENT_ITEMS_URL,
    setState,
    data
  );
};

const getERPAccountsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ERP_ACCOUNTS_URL,
    setState,
    data
  );
};


const getAllReceiptsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_RECEIPTS_URL,
    setState,
    data
  );
};

const getReceiptByIdApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_RECEIPT_BY_ID_URL,
    setState,
    data
  );
};

const createReceiptApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_RECEIPT_URL,
    setState,
    data
  );
};

export {
  getClientPaymentItemsApi,
  getERPAccountsApi,
  getAllReceiptsApi,
  getReceiptByIdApi,
  createReceiptApi
};
