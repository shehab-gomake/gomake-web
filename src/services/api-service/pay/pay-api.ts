import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const PAYMENT_URL = "/v1/erp-service/pay/send-document-to-client-for-payment";
const DOCUMENT_CONTACT_URL = "/v1/erp-service/documents/get-document-contact";
const GET_PRE_PAYMENT_BY_ID_URL = "/v1/erp-service/pay/get-pre-payment-by-id";
const SEND_PRE_PAYMENT_TO_CLIENT_URL =
  "/v1/erp-service/pay/send-pre-payment-to-client";
const COPY_PRE_PAYMENT_LINK_URL = "/v1/erp-service/pay/copy-pre-payment-link";
const CREATE_PAYMENT_TRANSACTION_URL =
  "/v1/erp-service/receipts/create-payment-transaction";
const CREATE_DEBTS_PAYMENT_TRANSACTION_URL =
  "/v1/erp-service/receipts/create-debts-payment-transaction";
const GET_DEBTS_PAYMENT_BY_ID_URL =
  "/v1/erp-service/pay/get-debts-payment-by-id";

const GET_DOCUMENT_PDF_BY_NUMBER_URL =
  "/v1/erp-service/documents/get-document-pdf-by-number";

const sendDocumentToClientForPaymentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    PAYMENT_URL,
    setState,
    data
  );
};

const getDocumentContactApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    DOCUMENT_CONTACT_URL,
    setState,
    data
  );
};

const getPrePaymentByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRE_PAYMENT_BY_ID_URL,
    setState,
    data
  );
};

const sendPrePaymentToClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_PRE_PAYMENT_TO_CLIENT_URL,
    setState,
    data
  );
};

const CopyPrePaymentLinkApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    COPY_PRE_PAYMENT_LINK_URL,
    setState,
    data
  );
};

const createPaymentTransactionApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_PAYMENT_TRANSACTION_URL,
    setState,
    data,
    true,
    null,
    true
  );
};

const getDebtsPaymentByIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DEBTS_PAYMENT_BY_ID_URL,
    setState,
    data
  );
};

const createDebitsPaymentTransactionApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_DEBTS_PAYMENT_TRANSACTION_URL,
    setState,
    data,
    true,
    null,
    true
  );
};

const getDocumentPdfByNumberApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_PDF_BY_NUMBER_URL,
    setState,
    data
  );
};

export {
  sendDocumentToClientForPaymentApi,
  getDocumentContactApi,
  getPrePaymentByIdApi,
  sendPrePaymentToClientApi,
  CopyPrePaymentLinkApi,
  createPaymentTransactionApi,
  getDebtsPaymentByIdApi,
  createDebitsPaymentTransactionApi,
  getDocumentPdfByNumberApi,
};
