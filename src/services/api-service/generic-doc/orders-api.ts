import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_PROFITS_CHART_DATA_URL =
  "/v1/erp-service/orders/get-profits-chart-data";
const EXPORT_DELIVERY_TICKET_PDF_URL =
  "/v1/erp-service/order/export-delivery-ticket-PDF";
const PRINT_DELIVERY_TICKET_PDF_URL =
  "/v1/erp-service/order/print-delivery-ticket-PDF";
const getProfitsChartDataApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PROFITS_CHART_DATA_URL,
    setState,
    data
  );
};

const exportDeliveryTicketPDFApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_DELIVERY_TICKET_PDF_URL,
    setState,
    data
  );
};

const printDeliveryTicketPDFApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    PRINT_DELIVERY_TICKET_PDF_URL,
    setState,
    data
  );
};

const UPDATE_LOCKED_ORDER_URL = "/v1/erp-service/documents/update-locked-order";

const toggleOrderLockApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { orderId: string; isLocked: boolean }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UPDATE_LOCKED_ORDER_URL}/${data.orderId}`,
    setState,
  );
};

export { getProfitsChartDataApi, exportDeliveryTicketPDFApi, printDeliveryTicketPDFApi, toggleOrderLockApi };
