import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const GET_ALL_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/get-all-documents-types';
const GET_DOCUMENT_DESIGN_BY_CREATION_DOC_URL = '/v1/erp-service/documentSettings/get-documents-design';
const ADD_OR_UPDATE_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/update-document-design';
const RESET_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/reset-documents-design';

const getAllDocumentDesigningApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_DOCUMENT_DESIGN_URL, setState)
}
const getDocumentDesignByCreationDocApi: ICallAndSetData = async (callApi, setState , data ) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_DOCUMENT_DESIGN_BY_CREATION_DOC_URL, setState,data)
}
const ResetDocumentDesigningApi: ICallAndSetData = async (callApi, setState , data ) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, RESET_DOCUMENT_DESIGN_URL, setState,data)
}
const AddOrUpdateDocumentDesignDocApi: ICallAndSetData = async (callApi, setState , data ) => {
    return  await getSetApiData(callApi, EHttpMethod.POST, ADD_OR_UPDATE_DOCUMENT_DESIGN_URL, setState,data)
}

export {
    getAllDocumentDesigningApi,
    getDocumentDesignByCreationDocApi,
    AddOrUpdateDocumentDesignDocApi,
    ResetDocumentDesigningApi

};