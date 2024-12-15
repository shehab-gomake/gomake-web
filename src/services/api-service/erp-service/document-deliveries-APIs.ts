import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";

const GET_DOCUMENT_DELIVERY_ITEMS_URL =
  "/v1/erp-service/document-deliveries/get-document-delivery-items";
const CREATE_DOCUMENT_DELIVERY_URL =
  "/v1/erp-service/document-deliveries/create-document-delivery";

const getDocumentDeliveryItemsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_DELIVERY_ITEMS_URL,
    setState,
    data
  );
};

const createDocumentDeliveryApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_DOCUMENT_DELIVERY_URL,
    setState,
    data
  );
};

export { getDocumentDeliveryItemsApi, createDocumentDeliveryApi };
