import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_ACCOUNTS_URL = "/v1/erp-service/finance/get-accounts";
const DOWNLOAD_CPA_FILE_URL = "/v1/erp-service/finance/download-cpa-file";
const UPDATE_CPA_MANAGER_NAME_URL = '/v1/erp-service/finance/update-cpa-manager-name';
const UPDATE_CPA_MANAGER_MAIL_URL = '/v1/erp-service/finance/update-cpa-manager-mail';
const UPDATE_SEND_CPA_REPORT_URL = '/v1/erp-service/finance/update-send-cpa-report';
const UPDATE_CPA_ACCOUNT_CODE_URL = '/v1/erp-service/finance/update-cpa-account-code';
const GET_FINANCIAL_PERIOD_URL = '/v1/erp-service/finance/get-financial-period';
const UPDATE_FINANCIAL_PERIOD_URL = '/v1/erp-service/finance/update-financial-period';


const getAccountsApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ACCOUNTS_URL,
    setState,
    false
  );
};


const downloadCpaFileApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DOWNLOAD_CPA_FILE_URL,
    setState,
    data,
    false
  );
};


const updateCpaManagerNameApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CPA_MANAGER_NAME_URL,
    setState,
    data,
    false
  );
};

const updateCpaManagerMailApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CPA_MANAGER_MAIL_URL,
    setState,
    data,
    false
  );
};

const updateSendCpaReportApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_SEND_CPA_REPORT_URL,
    setState,
    data,
    false
  );
};


const updateCpaAccountCodeApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_CPA_ACCOUNT_CODE_URL,
    setState,
    data,
    false
  );
};


const getFinancialPeriodApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_FINANCIAL_PERIOD_URL,
    setState,
    data,
  );
};


const updateFinancialPeriodApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_FINANCIAL_PERIOD_URL,
    setState,
    data,
    false
  );
};


export {
  getAccountsApi,
  downloadCpaFileApi,
  updateCpaManagerNameApi,
  updateCpaManagerMailApi,
  updateSendCpaReportApi,
  updateCpaAccountCodeApi,
  getFinancialPeriodApi,
  updateFinancialPeriodApi
};
