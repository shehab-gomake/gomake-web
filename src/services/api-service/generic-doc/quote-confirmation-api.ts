import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_DOCUMENT_BY_ID_URL = "/v1/erp-service/quote-confirmation/get-document-by-id";
const PUT_DOCUMENT_ITEMS_URL = "/v1/erp-service/quote-confirmation/approve-document-items";
const UPDATE_DOCUMENT_COMMENTS_URL = "/v1/erp-service/quote-confirmation/update-document-comments-confirmation";
const REJECT_DOCUMENT_URL = "/v1/erp-service/quote-confirmation/reject-document";
const CALCULATE_SELECTED_ITEMS_URL= "/v1/erp-service/quote-confirmation/calculate-document-items";

const getDocumentByIdApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_BY_ID_URL,
    setState,
    data
  );
};


const approveDocumentItemsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    PUT_DOCUMENT_ITEMS_URL,
    setState,
    data
  );
};


const rejectDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    REJECT_DOCUMENT_URL,
    setState,
    data
  );
};

const updateDocumentCommentsConfirmationApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_COMMENTS_URL,
    setState,
    data
  );
};


const calculateSelectedItemsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CALCULATE_SELECTED_ITEMS_URL,
    setState,
    data
  );
};

export {
    getDocumentByIdApi,
    approveDocumentItemsApi,
    rejectDocumentApi,
    updateDocumentCommentsConfirmationApi,
    calculateSelectedItemsApi
};
