import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";
const GET_ALL_CREDIT_CARD_TRANSACTION_URL = '/v1/erp-service/receipts/get-all-credit_card_receipts';

const getAllCreditCardTransactionsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.POST,
      GET_ALL_CREDIT_CARD_TRANSACTION_URL,
      setState,
      data
    );
  };