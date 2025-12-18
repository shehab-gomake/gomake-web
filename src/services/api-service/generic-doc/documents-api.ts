import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { ICallAndSetData } from "@/services/api-service/interface";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const GET_DOCUMENT_URL = "/v1/erp-service/documents/get-document";
const GET_ALL_DOCUMENTS_URL = "/v1/erp-service/documents/get-all-documents";
const GET_ALL_DOCUMENT_LOGS_URL =
  "/v1/erp-service/documents/get-all-document-logs";
const DELETE_DOCUMENT_ITEM_URL =
  "/v1/erp-service/documents/delete-document-item";
const ADD_DOCUMENT_CONTACT_URL =
  "/v1/erp-service/document/add-document-contact";
const UPDATE_DOCUMENT_CONTACTS_REORDER_URL =
  "/v1/erp-service/document/update-document-contacts-reorder";
const UPDATE_DOCUMENT_CONTACT_URL =
  "/v1/erp-service/document/update-document-contact";
const DELETE_DOCUMENT_CONTACT_URL =
  "/v1/erp-service/documents/delete-document-contact";
const ADD_DOCUMENT_ADDRESS_URL =
  "/v1/erp-service/document/add-document-address";
const UPDATE_DOCUMENT_ADDRESS_URL =
  "/v1/erp-service/document/update-document-address";
const UPDATE_DOCUMENT_PREFERENCE_URL =
  "/v1/erp-service/document/update-document-preference";
const DELETE_DOCUMENT_ADDRESS_URL =
  "/v1/erp-service/documents/delete-document-address";
const DELETE_DELIVERY_ITEM_URL =
  "/v1/erp-service/documents/delete-delivery-item";
const DUPLICATE_DOCUMENT_URL = "/v1/erp-service/documents/duplicate-document";

const DUPLICATE_DOCUMENT_ITEM_URL =
  "/v1/erp-service/documents/duplicate-document-item-with-another-quantity";
const CHANGE_DOCUMENT_CLIENT_URL =
  "/v1/erp-service/documents/change-document-client";
const UPDATE_DOCUMENT_ITEM_SELECT_URL =
  "/v1/erp-service/documents/update-docuement-item-select";
const GET_IF_Exist_CART = "/v1/erp-service/documents/get-exist-document";
const GET_DOCUMENT_PDF_URL = "/v1/erp-service/documents/get-document-pdf";
const GET_PDF_LINK_URL = "/v1/erp-service/documents/get-pdf-link";
const GET_BOARD_MISSION_PDF =
  "/v1/erp-service/board-missions-tables/export-board-mission-pdf";
const GET_ORDER_BOARD_MISSION_PDF =
  "/v1/erp-service/documents/export-order-board-mission-pdf";
const GET_ORDER_SUMMARY_PDF = "/v1/erp-service/documents/get-order-print-node";
const GET_PRINTING_TICKET_PDF =
  "/v1/erp-service/board-missions-tables/get-printing-ticket-pdf";
const UPDATE_PURCHASE_NUMBER_URL =
  "/v1/erp-service/documents/update-purchase-number";
const CHECK_PURCHASE_NUMBER_EXISTS_URL =
  "/v1/erp-service/documents/check-purchase-number-exists";
const ADD_DELIVERY_URL = "/v1/erp-service/documents/add-delivery";
const ADD_RELATED_DOCUMENT_URL =
  "/v1/erp-service/documents/add-related-document";
const CANCEL_DOCUMENT_URL = "/v1/erp-service/documents/cancel-document";
const SEND_DOCUMENT_TO_CLIENT_URL =
  "/v1/erp-service/documents/send-document-to-client";
const GET_DOCUMENT_MAIL_DATA_URL =
  "/v1/erp-service/documents/get-document-mail-data";
const UPDATE_DOCUMENT_STATUS_URL =
  "/v1/erp-service/documents/update-document-status";
const UNDO_DOCUMENT_INTAKE_URL =
  "/v1/erp-service/documents/undo-document-intake";
const UNDO_DOCUMENT_ITEM_INTAKE_URL =
  "/v1/erp-service/documents/undo-document-item-intake";
const SEND_ORDER_READY_TO_CLIENT_URL =
  "/v1/jobs-service/board-missions/send-order-ready-to-client";
const SAVE_DOCUMENT_URL = "/v1/erp-service/documents/save-document";
const ACCEPT_DOCUMENT_URL = "/v1/erp-service/documents/approved-by-manager";
const REJECT_DOCUMENT_URL = "/v1/erp-service/documents/rejected-by-manager";
const CONVERT_QUOTE_TO_ORDER_URL =
  "/v1/erp-service/documents/convert-quote-to-order";
const GET_CALCULATE_DOCUMENT_ITEM_URL =
  "/v1/erp-service/documents/calculate-document-item";
const GET_CALCULATE_DOCUMENT_URL =
  "/v1/erp-service/documents/calculate-document";
const ADD_ITEM_URL = "/v1/erp-service/documents/add-item";
const ADD_GENERIC_PRODUCT_TO_DOCUMENT_URL =
  "/v1/erp-service/documents/add-generic-product-to-document";
const UPDATE_DOCUMENT_URL = "/v1/erp-service/documents/update-document";
const UPDATE_OCCASIONAL_CLIENT_NAME_URL =
  "/v1/erp-service/documents/update-occasional-client-name";
const UPDATE_DOCUMENT_ITEM_URL =
  "/v1/erp-service/documents/update-document-item";
const UPDATE_DUE_DATE_URL = "/v1/erp-service/documents/update-due-date";
const UPDATE_AGENT_URL = "/v1/erp-service/documents/update-agent";
const GET_PRODUCT_ITEM_BY_ID_URL =
  "/v1/erp-service/documents/get-product-document-item-by-id";
const GET_PRODUCT_CALCULATION_EXCEPTION_BY_ID_URL =
  "/v1/erp-service/productItemValueDrafts/get-product-calculation-exception-by-id";
const UPDATE_DOCUMENT_CURRENCY_URL =
  "/v1/erp-service/documents/update-document-currency";
const UPDATE_DOCUMENT_VAT_STATUS_URL =
  "/v1/erp-service/documents/update-document-vat-status";
const UPDATE_EXCHANGE_RATE_URL =
  "/v1/erp-service/documents/update-document-exchange-rate";
const REFRESH_EXCHANGE_RATE_URL =
  "/v1/erp-service/documents/refresh-exchange-rate";
const CREATE_NEW_DOCUMENT_URL = "/v1/erp-service/documents/create-new-document";
const GET_ALL_REPORTS_URL = "/v1/erp-service/quote/get-all-reports";
const UPDATE_DOCUMENT_ITEM_CONTENT_URL =
  "/v1/erp-service/document/update-document-item-content";
const UPDATE_DOCUMENT_COMMENTS_URL =
  "/v1/erp-service/document/update-document-comments";
const UPDATE_DOCUMENT_INTERNAL_NOTES_URL =
  "/v1/erp-service/document/update-document-internal-notes";
const GET_CLIENT_DOCUMENTS = "/v1/erp-service/documents/get-client-documents";

const GET_ALL_BUDGETS_FOR_CLIENT =
  "/v1/erp-service/budgets/get-all-budgets-for-client";
const GET_ALL_DOCUMENTS_BY_BUDGET_ID =
  "/v1/erp-service/budgets/get-all-documents-by-budget-id";

const GET_ALL_DOCUMENTS_BY_BUDGET =
  "/v1/erp-service/budgets/get-all-documents-for-budget";

const GET_ALL_CLIENT_ACTIVE_BUDGETS =
  "/v1/erp-service/budgets/get-client-active-budgets";

const ADD_CREATE_CONTACT_URL = "/v1/crm-service/customer/create-contact";
const SORT_DOCUMENT_ITEMS_URL = "/v1/erp-service/documents/sort-document-items";
const UPDATE_DISCOUNT_TYPE_URL =
  "/v1/erp-service/documents/update-discount=type";
const UPDATE_IS_SHOW_DETAILS_URL =
  "/v1/erp-service/documents/update-is-show-details";
const UPDATE_IS_SHOW_PRICES_URL =
  "/v1/erp-service/documents/update-is-show-prices";
const GET_WHATSAPP_MESSAGE_URL =
  "/v1/erp-service/documents/get-whats-app-message";
const CLOSE_DOCUMENT_URL = "/v1/erp-service/documents/close-document";
const OPEN_DOCUMENT_URL = "/v1/erp-service/documents/open-document";
const OPEN_CANCELED_DOCUMENT_URL =
  "/v1/erp-service/documents/open-canceled-document";
const MANUALLY_CLOSE_DOCUMENT_URL =
  "/v1/erp-service/documents/manually-close-document";
const SEND_QUOTE_APPROVAL_TO_MANAGER =
  "/v1/erp-service/documents/send-quote-approval-to-manager";
const PAY_ORDER_IN_URL = "/v1/erp-service/documents/pay-order-in-tracking";
const QUICK_DUPLICATE_URL = "/v1/erp-service/documents/quick-duplicate";
const CLOSE_AND_TRACK_ORDER_URL =
  "/v1/erp-service/documents/close-and-track-order";
const UPDATE_DOCUMENT_TITLE_URL =
  "/v1/erp-service/documents/update-document-title";
const EXPORT_DOCUMENT_TABLE_TO_EXCEL_URL =
  "/v1/erp-service/documents/export-document-table-to-excel";
const EXPORT_DOCUMENT_TABLE_TO_PDF_URL =
  "/v1/erp-service/documents/export-document-table-to-PDF";
const SEND_RECEIPIT_TO_CLIENT_URL =
  "/v1/erp-service/receipt/send-receipt-to-client";
const GET_WHATSAPP_MESSAGE_FOR_RECEIPIT_URL =
  "/v1/erp-service/receipt/get-whats-app-message-for-receipt";
const MOVE_ORDER_TO_DONE_URL = "/v1/erp-service/documents/move-order-to-done";
const PAUSE_OR_RESUME_DOCUMENT_URL =
  "/v1/erp-service/documents/pause-or-resume-document";
const CREATE_DOCUMENT_URL = "/v1/erp-service/documents/create-document";
const START_ORDER_PRODUCTION_URL =
  "/v1/erp-service/documents/start-order-production";

const DELETE_DOCUMENT_ATTACHMENT_URL =
  "/v1/erp-service/documents/delete-document-attachment";

const GET_ALL_DOCUMENT_DELIVERY_DATE_URL =
  "/v1/erp-service/documents/get-document-delivery-date";

const UPDATE_QUOTE_DOCUMENT_ITEM_QUANTITY_URL =
  "/v1/erp-service/documents/update-quote-item-quantity";
const SAVE_DRAFT_DOCUMENT_URL =
  "/v1/erp-service/documents/create-draft-document";
const REMOVE_DRAFT_DOCUMENT_URL =
  "/v1/erp-service/documents/remove-draft-document";

const SAVE_DOCUMENT_TABLE_SETTINGS_URL =
  "/v1/erp-service/documents-table-settings/save-document-table-settings";

const GET_DOCUMENT_TABLE_SETTINGS_URL =
  "/v1/erp-service/documents-table-settings/get-document-table-settings";

const RE_CALCULATE_ITEM_URL = "/v1/erp-service/document/re-calculate-item";
const UPDATE_QUOTE_CLIENT_NOTE_AS_SHOWN_URL =
  "/v1/erp-service/documents/update-quote-client-note-as-shown";
const GET_DOCUMENT_INVENTORY_URL =
  "/v1/erp-service/documents/get-document-inventory";
const ADD_COMPOSITE_PRODUCTS_URL = "/v1/erp-service/add-composite-products";

const getDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data,
  loading,
  abortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_URL,
    setState,
    data,
    loading,
    abortController
  );
};

const getAllDocumentsApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_DOCUMENTS_URL,
    setState,
    data
  );
};

const getAllDocumentLogsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_DOCUMENT_LOGS_URL,
    setState,
    data
  );
};
const changeDocumentClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CHANGE_DOCUMENT_CLIENT_URL,
    setState,
    data
  );
};

const deleteDocumentItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_DOCUMENT_ITEM_URL,
    setState,
    data
  );
};

const addDocumentContactApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_DOCUMENT_CONTACT_URL,
    setState,
    data
  );
};

const updateDocumentContactsReorderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_DOCUMENT_CONTACTS_REORDER_URL,
    setState,
    data
  );
};
const addCustomerContactApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_CREATE_CONTACT_URL,
    setState,
    data
  );
};

const updateDocumentContactApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_CONTACT_URL,
    setState,
    data
  );
};

const deleteDocumentContactApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_DOCUMENT_CONTACT_URL,
    setState,
    data
  );
};

const addDocumentAddressApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_DOCUMENT_ADDRESS_URL,
    setState,
    data
  );
};

const updateDocumentAddressApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_ADDRESS_URL,
    setState,
    data
  );
};

const updateDocumentPreferenceApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_PREFERENCE_URL,
    setState,
    data
  );
};
const deleteDocumentAddressApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_DOCUMENT_ADDRESS_URL,
    setState,
    data
  );
};

const deleteDeliveryItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_DELIVERY_ITEM_URL,
    setState,
    data
  );
};

const duplicateDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentId: string; documentType: number }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DUPLICATE_DOCUMENT_URL,
    setState,
    data
  );
};

const duplicateWithAnotherQuantityApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DUPLICATE_DOCUMENT_ITEM_URL,
    setState,
    data
  );
};

const getIfCartExistApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_IF_Exist_CART,
    setState,
    data
  );
};

const getDocumentPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { quoteId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_PDF_URL,
    setState,
    data
  );
};

const getPdfLinkApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { printHouseId: string; linkId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_PDF_LINK_URL}/${data.printHouseId}/${data.linkId}`,
    setState,
    {}
  );
};

const updatePurchaseNumberApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PURCHASE_NUMBER_URL,
    setState,
    data
  );
};

const checkPurchaseNumberExistsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CHECK_PURCHASE_NUMBER_EXISTS_URL,
    setState,
    data
  );
};

const addDeliveryApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_DELIVERY_URL,
    setState,
    data
  );
};

const addRelatedDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_RELATED_DOCUMENT_URL,
    setState,
    data
  );
};

const cancelDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CANCEL_DOCUMENT_URL,
    setState,
    data
  );
};

const updateDocumentStatusApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentType: DOCUMENT_TYPE; [key: string]: any }
) => {
  const { documentType, ...payload } = data || {};
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UPDATE_DOCUMENT_STATUS_URL}/${documentType}`,
    setState,
    payload
  );
};

const undoDocumentIntakeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentType: DOCUMENT_TYPE; purchaseOrderId: string; status: number; shouldUndoIntake: boolean }
) => {
  const { documentType, ...payload } = data || {};
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UNDO_DOCUMENT_INTAKE_URL}/${documentType}`,
    setState,
    payload
  );
};

const undoDocumentItemIntakeApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentType: DOCUMENT_TYPE; itemId: string }
) => {
  const { documentType, itemId } = data || {};
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UNDO_DOCUMENT_ITEM_INTAKE_URL}/${documentType}/${itemId}`,
    setState,
    {}
  );
};

const sendDocumentToClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_DOCUMENT_TO_CLIENT_URL,
    setState,
    data,
    true
  );
};

const getDocumentMailDataApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_DOCUMENT_MAIL_DATA_URL,
    setState,
    data,
    true
  );
};

const sendOrderReadyToClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_ORDER_READY_TO_CLIENT_URL,
    setState,
    data,
    true
  );
};

const saveDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_DOCUMENT_URL,
    setState,
    data
  );
};

const acceptDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    ACCEPT_DOCUMENT_URL,
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

const createOrderApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CONVERT_QUOTE_TO_ORDER_URL,
    setState,
    data,
    true,
    null,
    true
  );
};

const calculateDocumentItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    documentType: DOCUMENT_TYPE;
    ItemId: string;
    data: number;
    calculationType: number;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CALCULATE_DOCUMENT_ITEM_URL,
    setState,
    data
  );
};

const updateQuoteItemQuantityApi: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    printHouseId: string;
    ItemId: string;
    quantity: number;
    documentItemIds: string[];
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_QUOTE_DOCUMENT_ITEM_QUANTITY_URL,
    setState,
    data
  );
};

const calculateDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CALCULATE_DOCUMENT_URL,
    setState,
    data
  );
};

const addItemApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_ITEM_URL,
    setState,
    data
  );
};

const addGenericProductToDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_GENERIC_PRODUCT_TO_DOCUMENT_URL,
    setState,
    data
  );
};

const updateDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_URL,
    setState,
    data
  );
};
const updateOccasionalClientNameApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_OCCASIONAL_CLIENT_NAME_URL,
    setState,
    data
  );
};

const updateDocumentItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_ITEM_URL,
    setState,
    data
  );
};

const updateDueDateApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DUE_DATE_URL,
    setState,
    data
  );
};

const updateAgentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_AGENT_URL,
    setState,
    data
  );
};

const getProductByItemIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRODUCT_ITEM_BY_ID_URL,
    setState,
    data
  );
};

const getProductCalculationExceptionByIdApi: ICallAndSetData = async (  
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRODUCT_CALCULATION_EXCEPTION_BY_ID_URL,
    setState,
    data
  );
};

const updateDocumentCurrencyApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_CURRENCY_URL,
    setState,
    data
  );
};

const updateDocumentVatStatusApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_DOCUMENT_VAT_STATUS_URL,
    setState,
    data
  );
};

const updateExchangeRateApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_EXCHANGE_RATE_URL,
    setState,
    data
  );
};

const refreshExchangeRateApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    REFRESH_EXCHANGE_RATE_URL,
    setState,
    data
  );
};

const createNewDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  payload: { documentType: DOCUMENT_TYPE; clientId?: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_NEW_DOCUMENT_URL,
    setState,
    payload,
    true,
    null,
    true
  );
};

const getAllReportsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { customerId: string; productId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_REPORTS_URL,
    setState,
    data
  );
};

const updateDocumentItemContentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_ITEM_CONTENT_URL,
    setState,
    data
  );
};
const updateDocumentCommentsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_COMMENTS_URL,
    setState,
    data
  );
};
const updateDocumentInternalNotesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_INTERNAL_NOTES_URL,
    setState,
    data
  );
};

const getClientDocumentsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { clientId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_CLIENT_DOCUMENTS,
    setState,
    data,
    false
  );
};

const getAllBudgetsForClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { clientId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_BUDGETS_FOR_CLIENT,
    setState,
    data,
    false
  );
};

const getAllDocumentsByBudgetIdApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { budgetId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_DOCUMENTS_BY_BUDGET_ID,
    setState,
    data,
    false
  );
};

const getAllDocumentsByBudgetApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { clientId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_DOCUMENTS_BY_BUDGET,
    setState,
    data,
    false
  );
};

const getAllClientActiveBudgetsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { clientId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ALL_CLIENT_ACTIVE_BUDGETS,
    setState,
    data,
    false
  );
};

const getBoardMissionPDF: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardMissionId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_BOARD_MISSION_PDF,
    setState,
    data
  );
};

const getOrderBoardMissionPDF: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ORDER_BOARD_MISSION_PDF,
    setState,
    data
  );
};

const getOrderSummaryPDF: ICallAndSetData = async (
  callApi,
  setState,
  data: { documentId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_ORDER_SUMMARY_PDF,
    setState,
    data
  );
};

const GetPrintingTicketPDFApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { boardMissionId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_PRINTING_TICKET_PDF,
    setState,
    data
  );
};

const sortDocumentItemsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    SORT_DOCUMENT_ITEMS_URL,
    setState,
    data
  );
};

const updateDiscountTypeApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DISCOUNT_TYPE_URL,
    setState,
    data
  );
};

const updateIsShowDetailsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_IS_SHOW_DETAILS_URL,
    setState,
    data
  );
};

const updateIsShowPricesApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_IS_SHOW_PRICES_URL,
    setState,
    data
  );
};
const getWhatsAppMessageApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_WHATSAPP_MESSAGE_URL,
    setState,
    data
  );
};

const CloseDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    CLOSE_DOCUMENT_URL,
    setState,
    data
  );
};

const updateDocuementItemSelectApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_ITEM_SELECT_URL,
    setState,
    data
  );
};

const manuallyCloseDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    MANUALLY_CLOSE_DOCUMENT_URL,
    setState,
    data
  );
};

const sendQuoteApprovalToManagerApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_QUOTE_APPROVAL_TO_MANAGER,
    setState,
    data
  );
};

const makePaymentForOrderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    PAY_ORDER_IN_URL,
    setState,
    data
  );
};

const quickDuplicateApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    QUICK_DUPLICATE_URL,
    setState,
    data
  );
};

const closeAndTrackOrderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CLOSE_AND_TRACK_ORDER_URL,
    setState,
    data
  );
};

const updateDocumentTitleApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_DOCUMENT_TITLE_URL,
    setState,
    data
  );
};

const OpenDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    OPEN_DOCUMENT_URL,
    setState,
    data
  );
};

const ExportDocumentTableToExcelApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_DOCUMENT_TABLE_TO_EXCEL_URL,
    setState,
    data
  );
};

const ExportDocumentTableToPdfApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    EXPORT_DOCUMENT_TABLE_TO_PDF_URL,
    setState,
    data
  );
};

const OpenCanceledDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    OPEN_CANCELED_DOCUMENT_URL,
    setState,
    data
  );
};

const sendReceiptToClientApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SEND_RECEIPIT_TO_CLIENT_URL,
    setState,
    data,
    true
  );
};

const getWhatsAppMessageForReceiptApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_WHATSAPP_MESSAGE_FOR_RECEIPIT_URL,
    setState,
    data
  );
};

const moveOrderToReadyApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    MOVE_ORDER_TO_DONE_URL,
    setState,
    data
  );
};

const moveOrderToDoneApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    MOVE_ORDER_TO_DONE_URL,
    setState,
    data
  );
};

const pauseOrdResumeOrderApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    PAUSE_OR_RESUME_DOCUMENT_URL,
    setState,
    data
  );
};

const createDocumentApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_DOCUMENT_URL,
    setState,
    data,
    true,
    null,
    true
  );
};

const startOrderProductionApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    START_ORDER_PRODUCTION_URL,
    setState,
    data
  );
};

const deleteDocumentAttachmentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DELETE_DOCUMENT_ATTACHMENT_URL,
    setState,
    data
  );
};

const getDocumentDeliveryDateApi: ICallAndSetData = async (
  callApi,
  setState
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_ALL_DOCUMENT_DELIVERY_DATE_URL,
    setState
  );
};

const saveDraftDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_DRAFT_DOCUMENT_URL,
    setState,
    data
  );
};

const removeDraftDocumentApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    REMOVE_DRAFT_DOCUMENT_URL,
    setState,
    data
  );
};

const saveDocumentTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    SAVE_DOCUMENT_TABLE_SETTINGS_URL,
    setState,
    data
  );
};

const getDocumentTableSettingsApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_TABLE_SETTINGS_URL,
    setState,
    data
  );
};

const reCalculateItemApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    RE_CALCULATE_ITEM_URL,
    setState,
    data
  );
};

const updateQuoteClientNoteAsShownApi: ICallAndSetData = async (
  callApi,
  setState,
  data: { quoteId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    `${UPDATE_QUOTE_CLIENT_NOTE_AS_SHOWN_URL}/${data.quoteId}`,
    setState,
    {}
  );
};
const getDocumentInventoryApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_INVENTORY_URL,
    setState,
    data
  );
};
const addCompositeProductsApi: ICallAndSetData = async (
  callApi,
  setState,
  data: {
    documentType: number;
    clientId: string;
    clientTypeId: string;
    orderId: string;
    compositeProducts: Array<{
      id: string;
      name: string;
      quantity: number;
      jobName: string;
    }>;
  }
) => {
  const url = `${ADD_COMPOSITE_PRODUCTS_URL}/${data.documentType}`;
  const requestBody = {
    clientId: data.clientId,
    clientTypeId: data.clientTypeId,
    orderId: data.orderId,
    compositeProducts: data.compositeProducts,
  };
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    url,
    setState,
    requestBody
  );
};

export {
  getDocumentApi,
  getAllDocumentsApi,
  deleteDocumentItemApi,
  addDocumentContactApi,
  updateDocumentContactsReorderApi,
  updateDocumentContactApi,
  deleteDocumentContactApi,
  addDocumentAddressApi,
  updateDocumentAddressApi,
  updateDocumentPreferenceApi,
  deleteDocumentAddressApi,
  deleteDeliveryItemApi,
  changeDocumentClientApi,
  getIfCartExistApi,
  duplicateDocumentApi,
  duplicateWithAnotherQuantityApi,
  getDocumentPdfApi,
  getPdfLinkApi,
  updatePurchaseNumberApi,
  checkPurchaseNumberExistsApi,
  addDeliveryApi,
  addRelatedDocumentApi,
  updateDocumentStatusApi,
  cancelDocumentApi,
  sendDocumentToClientApi,
  getDocumentMailDataApi,
  saveDocumentApi,
  createOrderApi,
  calculateDocumentItemApi,
  calculateDocumentApi,
  addItemApi,
  updateDocumentApi,
  updateDocumentItemApi,
  updateDueDateApi,
  updateAgentApi,
  getProductByItemIdApi,
  getProductCalculationExceptionByIdApi,
  updateDocumentCurrencyApi,
  updateDocumentVatStatusApi,
  updateExchangeRateApi,
  refreshExchangeRateApi,
  createNewDocumentApi,
  getAllReportsApi,
  updateDocumentItemContentApi,
  updateDocumentCommentsApi,
  getClientDocumentsApi,
  getAllDocumentLogsApi,
  addCustomerContactApi,
  getBoardMissionPDF,
  sortDocumentItemsApi,
  updateDiscountTypeApi,
  updateIsShowDetailsApi,
  getWhatsAppMessageApi,
  CloseDocumentApi,
  getOrderBoardMissionPDF,
  getOrderSummaryPDF,
  GetPrintingTicketPDFApi,
  updateDocuementItemSelectApi,
  updateIsShowPricesApi,
  updateDocumentInternalNotesApi,
  updateOccasionalClientNameApi,
  manuallyCloseDocumentApi,
  sendQuoteApprovalToManagerApi,
  acceptDocumentApi,
  rejectDocumentApi,
  makePaymentForOrderApi,
  closeAndTrackOrderApi,
  updateDocumentTitleApi,
  OpenDocumentApi,
  ExportDocumentTableToExcelApi,
  OpenCanceledDocumentApi,
  sendReceiptToClientApi,
  getWhatsAppMessageForReceiptApi,
  moveOrderToReadyApi,
  moveOrderToDoneApi,
  getAllBudgetsForClientApi,
  getAllDocumentsByBudgetIdApi,
  getAllDocumentsByBudgetApi,
  getAllClientActiveBudgetsApi,
  pauseOrdResumeOrderApi,
  createDocumentApi,
  startOrderProductionApi,
  addGenericProductToDocumentApi,
  quickDuplicateApi,
  deleteDocumentAttachmentApi,
  getDocumentDeliveryDateApi,
  sendOrderReadyToClientApi,
  updateQuoteItemQuantityApi,
  saveDraftDocumentApi,
  removeDraftDocumentApi,
  ExportDocumentTableToPdfApi,
  saveDocumentTableSettingsApi,
  getDocumentTableSettingsApi,
  reCalculateItemApi,
  updateQuoteClientNoteAsShownApi,
  getDocumentInventoryApi,
  addCompositeProductsApi,
  undoDocumentIntakeApi,
  undoDocumentItemIntakeApi,
};
