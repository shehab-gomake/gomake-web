import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_ALL_DEPOSITS_URL = "/v1/erp-service/deposits/get-all-deposits";
const GET_DEPOSITS_META_DATA_URL = "/v1/erp-service/deposits/get-deposit-meta-data";
const SHOW_DEPOSIT_URL = "/v1/erp-service/deposits/show-deposit";
const CREATE_DEPOSIT_URL = "/v1/erp-service/deposits/create-deposits";
const CANCEL_DEPOSIT_URL = "/v1/erp-service/deposits/cancel-deposit";

const getAllDepositsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_DEPOSITS_URL,
    setState,
    data
  );
};


const getDepositsMetaDataApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DEPOSITS_META_DATA_URL,
    setState,
  );
};


const showDepositApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    SHOW_DEPOSIT_URL,
    setState,
    data
  );
};

const createDepositApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_DEPOSIT_URL,
    setState,
    data
  );
};

const cancelDepositApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CANCEL_DEPOSIT_URL,
    setState,
    data
  );
};

export {
    getAllDepositsApi,
    getDepositsMetaDataApi,
    showDepositApi,
    createDepositApi,
    cancelDepositApi
};
