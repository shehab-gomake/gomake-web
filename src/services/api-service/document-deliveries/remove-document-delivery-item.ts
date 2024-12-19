import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";

const REMOVE_DOCUMENT_DELIVERY_ITEM_URL =
  "/v1/erp-service/document-deliveries/remove-document-delivery-item";

const removeDocumentDeliveryItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    REMOVE_DOCUMENT_DELIVERY_ITEM_URL,
    setState,
    data
  );
};

export { removeDocumentDeliveryItemApi };
