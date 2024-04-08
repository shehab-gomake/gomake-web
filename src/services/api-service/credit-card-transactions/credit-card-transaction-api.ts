import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const GET_ALL_CREDIT_CARD_TRANSACTION_URL = '/v1/erp-service/receipts/get-all-credit_card_transactions';
const MAKE_REFUND_URL = '/v1/erp-service/receipts/make-refund';
const CHANGE_TRANSACTION_CLIENT_URL = '/v1/erp-service/receipts/change-transaction-client';


const getCreditCardTransactionsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.POST,
      GET_ALL_CREDIT_CARD_TRANSACTION_URL,
      setState,
      data
    );
  };

  const changeTransactionClientApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.PUT,
      CHANGE_TRANSACTION_CLIENT_URL,
      setState,
      data
    );
  };

  const makeRefundApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.PUT,
      MAKE_REFUND_URL,
      setState,
      data
    );
  };

  export{ getCreditCardTransactionsApi , changeTransactionClientApi , makeRefundApi};