import { EHttpMethod } from "../enums";
import { getSetApiData } from "../get-set-api-data";
import { ICallAndSetData } from "../interface";

const CREATE_DOCUMENT_DELIVERY_URL =
  "/v1/erp-service/document-deliveries/create-document-delivery";

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
    data,
    true,
    null,
    true
  );
};

export { createDocumentDeliveryApi };
