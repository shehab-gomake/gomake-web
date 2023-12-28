import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const GET_DOCUMENT_URL = '/v1/erp-service/documents/get-document';
const GET_ALL_DOCUMENTS_URL='/v1/erp-service/documents/get-all-documents';
const DELETE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/delete-document-item';
const ADD_DOCUMENT_CONTACT_URL = '/v1/erp-service/document/add-document-contact';
const UPDATE_DOCUMENT_CONTACT_URL = '/v1/erp-service/document/update-document-contact';
const DELETE_DOCUMENT_CONTACT_URL = '/v1/erp-service/documents/delete-document-contact';
const ADD_DOCUMENT_ADDRESS_URL = '/v1/erp-service/document/add-document-address';
const UPDATE_DOCUMENT_ADDRESS_URL = '/v1/erp-service/document/update-document-address';
const DELETE_DOCUMENT_ADDRESS_URL = '/v1/erp-service/documents/delete-document-address';
const DUPLICATE_DOCUMENT_URL = '/v1/erp-service/documents/duplicate-document';
const DUPLICATE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/duplicate-document-item-with-another-quantity';
const CHANGE_DOCUMENT_CLIENT_URL = '/v1/erp-service/documents/change-document-client';
const GET_IF_Exist_CART = '/v1/erp-service/documents/get-exist-document';
const GET_DOCUMENT_PDF_URL = '/v1/erp-service/documents/get-document-pdf';
const UPDATE_PURCHASE_NUMBER_URL = '/v1/erp-service/documents/update-purchase-number';
const ADD_DELIVERY_URL = '/v1/erp-service/documents/add-delivery';
const CANCEL_DOCUMENT_URL = '/v1/erp-service/documents/cancel-document';
const SEND_DOCUMENT_TO_CLIENT_URL = '/v1/erp-service/documents/send-document-to-client';
const SAVE_DOCUMENT_URL = '/v1/erp-service/documents/save-document';
const CONVERT_QUOTE_TO_ORDER_URL = '/v1/erp-service/documents/convert-quote-to-order';
const GET_CALCULATE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/calculate-document-item';
const GET_CALCULATE_DOCUMENT_URL = '/v1/erp-service/documents/calculate-document';
const ADD_ITEM_URL = '/v1/erp-service/documents/add-item';
const UPDATE_DOCUMENT_URL = '/v1/erp-service/documents/update-document';
const UPDATE_DOCUMENT_ITEM_URL = '/v1/erp-service/documents/update-document-item';
const UPDATE_DUE_DATE_URL ='/v1/erp-service/documents/update-due-date';
const UPDATE_AGENT_URL ='/v1/erp-service/documents/update-agent';
const GET_PRODUCT_ITEM_BY_ID_URL= '/v1/erp-service/documents/get-product-document-item-by-id';

const getDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_DOCUMENT_URL, setState, data);
}

const getAllDocumentsApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, GET_ALL_DOCUMENTS_URL, setState, data);
}

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

const getIfCartExistApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_IF_Exist_CART, setState, data);
}

const getDocumentPdfApi: ICallAndSetData = async (callApi, setState, data: {quoteId: string}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_DOCUMENT_PDF_URL, setState, data);
} 

const updatePurchaseNumberApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_PURCHASE_NUMBER_URL, setState, data);
}

const addDeliveryApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_DELIVERY_URL, setState, data);
}

const cancelDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, CANCEL_DOCUMENT_URL, setState, data);
}

const sendDocumentToClientApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SEND_DOCUMENT_TO_CLIENT_URL, setState, data);
}

const saveDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SAVE_DOCUMENT_URL, setState, data);
}

const createOrderApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, CONVERT_QUOTE_TO_ORDER_URL, setState, data);
}

const calculateDocumentItemApi: ICallAndSetData = async (callApi, setState, 
    data: {documentType: DOCUMENT_TYPE,
    ItemId : string,
    data: number,
    calculationType: number}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_CALCULATE_DOCUMENT_ITEM_URL, setState, data);
} 

const calculateDocumentApi: ICallAndSetData = async (callApi, setState,data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_CALCULATE_DOCUMENT_URL, setState, data);
} 

const addItemApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, ADD_ITEM_URL, setState, data);
}

const updateDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_DOCUMENT_URL, setState, data);
}

const updateDocumentItemApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_DOCUMENT_ITEM_URL, setState, data);
}

const updateDueDateApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_DUE_DATE_URL, setState, data);
}

const updateAgentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_AGENT_URL, setState, data);
}


const getProductByItemIdApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRODUCT_ITEM_BY_ID_URL, setState, data);
} 

export {
    getDocumentApi,
    getAllDocumentsApi,
    deleteDocumentItemApi,
    addDocumentContactApi,
    updateDocumentContactApi,
    deleteDocumentContactApi,
    addDocumentAddressApi,
    updateDocumentAddressApi,
    deleteDocumentAddressApi,
    changeDocumentClientApi,
    getIfCartExistApi,
    duplicateDocumentApi,
    duplicateWithAnotherQuantityApi,
    getDocumentPdfApi,
    updatePurchaseNumberApi,
    addDeliveryApi,
    cancelDocumentApi,
    sendDocumentToClientApi,
    saveDocumentApi,
    createOrderApi,
    calculateDocumentItemApi,
    calculateDocumentApi,
    addItemApi,
    updateDocumentApi,
    updateDocumentItemApi,
    updateDueDateApi,
    updateAgentApi,
    getProductByItemIdApi
};