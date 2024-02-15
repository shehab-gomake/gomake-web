import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_CLIENT_PAYMENT_ITEMS_URL = "/v1/erp-service/receipts/get-new-receipt";
const GET_ERP_ACCOUNTS_URL = "/v1/erp-service/receipts/get-ERP-accounts";

const getClientPaymentItemsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CLIENT_PAYMENT_ITEMS_URL,
    setState,
    data
  );
};

const getERPAccountsApi: ICallAndSetData = async (callApi, setState ,data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ERP_ACCOUNTS_URL,
    setState,
    data
  );
};


export {
  getClientPaymentItemsApi,
  getERPAccountsApi,
};
