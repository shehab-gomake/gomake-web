import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const GET_ALL_DOCUMENT_NUMBERS_URL = '/v1/erp-service/documentSettings/get-all-documents-numbers';
const UPDATE_DOCUMENT_NUMBER_URL = '/v1/erp-service/documentSettings/update-document-numbers';


const getAllDocumentNumbersApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_DOCUMENT_NUMBERS_URL, setState)
}

const updateDocumentNumber: ICallAndSetData = async (callApi, setState, document) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, UPDATE_DOCUMENT_NUMBER_URL, setState, document);
}
export {getAllDocumentNumbersApi , updateDocumentNumber};