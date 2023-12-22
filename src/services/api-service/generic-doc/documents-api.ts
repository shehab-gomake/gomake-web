import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";

const DELETE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/delete-document-item';
const CHANGE_DOCUMENT_CLIENT_URL = '/v1/erp-service/documents/change-document-client';

const ADD_DOCUMENT_CONTACT_URL = '/v1/erp-service/document/add-document-contact';
const UPDATE_DOCUMENT_CONTACT_URL = '/v1/erp-service/document/update-document-contact';
const DELETE_DOCUMENT_CONTACT_URL = '/v1/erp-service/documents/delete-document-contact';

const ADD_DOCUMENT_ADDRESS_URL = '/v1/erp-service/document/add-document-address';
const UPDATE_DOCUMENT_ADDRESS_URL = '/v1/erp-service/document/update-document-address';
const DELETE_DOCUMENT_ADDRESS_URL = '/v1/erp-service/documents/delete-document-address';

const DUPLICATE_DOCUMENT_URL = '/v1/erp-service/documents/duplicate-document';
const DUPLICATE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/duplicate-document-item-with-another-quantity';

const GET_DOCUMENT_PDF_URL = '/v1/erp-service/documents/get-document-pdf';


const changeDocumentClientApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, CHANGE_DOCUMENT_CLIENT_URL, setState, data);
}

const deleteDocumentItemApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, DELETE_DOCUMENT_ITEM_URL, setState, data);
}

const addDocumentContactApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_DOCUMENT_CONTACT_URL, setState, data);
}

const updateDocumentContactApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_DOCUMENT_CONTACT_URL, setState, data);
}

const deleteDocumentContactApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, DELETE_DOCUMENT_CONTACT_URL, setState, data);
}

const addDocumentAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_DOCUMENT_ADDRESS_URL, setState, data);
}

const updateDocumentAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_DOCUMENT_ADDRESS_URL, setState, data);
}

const deleteDocumentAddressApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.DELETE, DELETE_DOCUMENT_ADDRESS_URL, setState, data);
}

const duplicateDocumentApi: ICallAndSetData = async (callApi, setState, data: {documentId: string , documentType: number}) => {
    return await getSetApiData(callApi, EHttpMethod.POST, DUPLICATE_DOCUMENT_URL, setState, data);
}

const duplicateWithAnotherQuantityApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, DUPLICATE_DOCUMENT_ITEM_URL, setState, data);
}

const getDocumentPdfApi: ICallAndSetData = async (callApi, setState, data: {quoteId: string}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_DOCUMENT_PDF_URL, setState, data);
} 

export {
    changeDocumentClientApi,
    deleteDocumentItemApi,
    addDocumentContactApi,
    updateDocumentContactApi,
    deleteDocumentContactApi,
    addDocumentAddressApi,
    updateDocumentAddressApi,
    deleteDocumentAddressApi,
    duplicateDocumentApi,
    duplicateWithAnotherQuantityApi,
    getDocumentPdfApi
};