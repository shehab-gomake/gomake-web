import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const GET_DOCUMENT_BY_ID_URL = "/v1/erp-service/quote-confirmation/get-document-by-id";


const getDocumentByIdApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_BY_ID_URL,
    setState,
    data
  );
};


export {
    getDocumentByIdApi,

};
