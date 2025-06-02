import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const CREATE_INVOICE_FROM_ORDER_ID_URL =
  "/v1/erp-service/invoices/create-invoice-from-order-id";

const GET_TAX_CONFIRMATION_NUMBER_URL =
  "/v1/erp-service/invoices/get-tax-confirmation-number";

const createInvoiceFromOrderIdApi: ICallAndSetData = async (
  callApi,
  setState,
  orderId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_INVOICE_FROM_ORDER_ID_URL,
    setState,
    { orderId },
    true,
    null,
    true
  );
};

const getTaxConfirmationNumberApi: ICallAndSetData = async (
  callApi,
  setState,
  documentId
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_TAX_CONFIRMATION_NUMBER_URL,
    setState,
    { documentId },
    true,
    null,
    true
  );
};

export { createInvoiceFromOrderIdApi, getTaxConfirmationNumberApi };
