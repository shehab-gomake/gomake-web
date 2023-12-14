import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const GET_ALL_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/get-all-documents-types';
const GET_DOCUMENT_DESIGN_BY_CREATION_DOC_URL = '/v1/erp-service/documentSettings/get-documents-design';
const ADD_OR_UPDATE_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/update-document-design';
const RESET_DOCUMENT_DESIGN_URL = '/v1/erp-service/documentSettings/reset-documents-design';

const getAllDocumentDesigningApi: ICallAndSetData<any, any> = async (callApi, setState) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_ALL_DOCUMENT_DESIGN_URL, setState)
}
const getDocumentDesignByCreationDocingApi: ICallAndSetData<any, any> = async (callApi, setState , data ) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, GET_DOCUMENT_DESIGN_BY_CREATION_DOC_URL, setState,data)
}
const ResetDocumentDesigningApi: ICallAndSetData<any, any> = async (callApi, setState , data ) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.GET, RESET_DOCUMENT_DESIGN_URL, setState,data)
}
const AddOrUpdateDocumentDesignDocingApi: ICallAndSetData<any, any> = async (callApi, setState , data ) => {
    return  await getSetApiData<any>(callApi, EHttpMethod.POST, ADD_OR_UPDATE_DOCUMENT_DESIGN_URL, setState,data)
}

export {
    getAllDocumentDesigningApi,
    getDocumentDesignByCreationDocingApi,
    AddOrUpdateDocumentDesignDocingApi,
    ResetDocumentDesigningApi

};