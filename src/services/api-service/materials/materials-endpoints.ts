import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  IDynamicRowData,
  IMaterialTableFilteringValue,
} from "@/widgets/materials-widget/interface";

const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
const GET_MATERIAL_TABLE_HEADERS_URL = "/v1/materials/GetMaterialTypeTableHeader";
const DOWNLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/upload-material-excel-file";
const UPDATE_MATERIALS_IMAGES = "/v1/materials/update-materials-images";
const UPLOAD_DOCUMENT_ATTACHMENT = "/v1/erp-service/documents/upload-document-attachment"
const UPLOAD_QUOTE_ITEM_FILE = "/v1/erp-service/document/upload-quote-item-file"
const REMOVE_QUOTE_ITEM_FILE = "/v1/erp-service/documents/remove-quote-item-file"
const UPDATE_SUPPLIER_PRIORITY = "/v1/materials/update-supplier-priority";
const GET_MATERIAL_CATEGORIES_URL = "/v1/materials/GetMaterialCategories";
const GET_MATERIAL_CATEGORY_BY_MATERIAL_KEY_URL = "/v1/print-house-materials/get-print-house-material-mapped-by-material-key";
const getDeviceSizeMockURL = "/v1/materials/get-device-size-material";
const GET_MATERIAL_CATEGORY_DATA_URL = "/v1/materials/GetMaterialCategoryData";
const UPDATE_MATERIAL_PROPS_URL = "/v1/materials/updateMaterial";
const UPDATE_MATERIALS_PROPS_URL = "/v1/materials/updateMaterials";
const ADD_MATERIAL_CATEGORY_URL = "/v1/materials/add-material-category";
const ADD_MATERIAL_CATEGORY_ROW_URL = "/v1/materials/add-material-category-row";
const UPDATE_MATERIAL_CATEGORY_NUMBERING_URL = "/v1/materials/update-material-category-numbering";
const DELETE_MATERIAL_CATEGORY_URL = "/v1/materials/delete-material-category";
const DELETE_MATERIAL_CATEGORY_Row_URL = "/v1/materials/delete-material-category-row";
const CREATE_PURCHASE_ORDER_URL = "/v1/materials/create-purchase-order";
const CREATE_DIE_CUT_FROM_TEMPLATE_MAKER_URL = "/v1/materials/create-die-cut-from-template-maker";
const UPLOAD_PRINT_HOUSE_MATERIAL_IMAGE_URL = "/v1/materials/upload-print-house-material-image";
const ADD_DOCUMENT_ITEM_FROM_MATERIAL_ROW = "/v1/printhouse-config/materials/add-document-item-from-material-row";
const GET_DOCUMENT_ITEM_DATA_FROM_MATERIALS = "/v1/materials/get-document-item-data-from-material";
const GET_DOCUMENT_ITEM_DATA_FROM_ROW_MATERIAL = "/v1/materials/get-document-item-data-from-row-material";

const TOGGLE_MATERIAL_TYPE_ACTIVE_URL = "/v1/materials/toggle-material-type-active";
const GET_GROUPED_MATERIAL_TYPES_URL = "/v1/materials/get-grouped-material-types";
const DELETE_PRINTHOUSE_MATERIAL_ROW_URL = "/v1/printhouse-materials/delete-printhouse-material-row";
const DELETE_MATERIAL_PRODUCT_URL = "/v1/materials/delete-material-product-by-id";
const ADD_MATERIAL_PRODUCT_URL = "/v1/materials/post-material-product-by-id";


const getMaterialTableHeadersApi: ICallAndSetData = async (
  callApi,
  setState,
  material: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_MATERIAL_TABLE_HEADERS_URL}?materialKey=${material}`,
    setState
  );
};

const getMaterialsTypesApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_MATERIALS_TYPES_URL,
    setState
  );
};

const getMaterialExcelFileApi: ICallAndSetData = async (
  callApi,
  setState,
  material: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${DOWNLOAD_MATERIAL_EXCEL_FILE}?materialKey=${material}`,
    setState
  );
};

const uploadMaterialExcelFileApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { key: string; base64: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPLOAD_MATERIAL_EXCEL_FILE,
    callBack,
    data
  );
};

const updateMaterialsImagesApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { base64ZipFile: string; materialTypeKey: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_MATERIALS_IMAGES,
    callBack,
    data
  );
};

const updateSupplierPriorityApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_SUPPLIER_PRIORITY,
    callBack,
    data
  );
};

const getMaterialCategoriesApi: ICallAndSetData = async (
  callApi,
  setState,
  material: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_MATERIAL_CATEGORIES_URL}?materialKey=${material}`,
    setState
  );
};

const getMaterialCategoryByMaterialKeyApi: ICallAndSetData = async (
  callApi,
  setState,
  material: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_MATERIAL_CATEGORY_BY_MATERIAL_KEY_URL}?materialKey=${material}`,
    setState
  );
};


const getDeviceSizeMockApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    getDeviceSizeMockURL,
    setState,
    data
  );
};


const getMaterialCategoryDataApi: ICallAndSetData = async (
  callApi,
  setState,
  material: {
    materialKey: string;
    categoryKey: string;
    pageNumber: number;
    pageSize: number;
    customFiltersKeyValueList: IMaterialTableFilteringValue[];
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_MATERIAL_CATEGORY_DATA_URL,
    setState,
    material,
    true
  );
};

const updateMaterialPropApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIAL_PROPS_URL,
    callBack,
    data,
    false
  );
};

const updateMaterialsPropApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIALS_PROPS_URL,
    callBack,
    data
  );
};

const addMaterialCategoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  category: { materialTypeKey: string; categoryKey: string, imageBase64: any; }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_MATERIAL_CATEGORY_URL,
    callBack,
    category
  );
};

const addMaterialCategoryRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  row: {
    materialKey: string;
    categoryKey: string;
    rowData: Record<string, IDynamicRowData>;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_MATERIAL_CATEGORY_ROW_URL,
    callBack,
    row
  );
};


const updateMaterialCategoryNumberingApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIAL_CATEGORY_NUMBERING_URL,
    callBack,
    data
  );
};

const deleteMaterialCategoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  category: { materialTypeKey: string; categoryKey: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DELETE_MATERIAL_CATEGORY_URL,
    callBack,
    category
  );
};

const deleteMaterialCategoryRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  row: { rowId: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DELETE_MATERIAL_CATEGORY_Row_URL,
    callBack,
    row
  );
};


const createPurchaseOrderApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_PURCHASE_ORDER_URL,
    callBack,
    data
  );
};

const createDieCutFromTemplateMakerApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    CREATE_DIE_CUT_FROM_TEMPLATE_MAKER_URL,
    callBack,
    data
  );
} 

const uploadPrintHouseMaterialApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPLOAD_PRINT_HOUSE_MATERIAL_IMAGE_URL,
    callBack,
    data
  );
};

const addDocumentItemFromMaterialRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_DOCUMENT_ITEM_FROM_MATERIAL_ROW,
    callBack,
    data
  );
};


const getDocumentItemDataFromMaterialApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_DOCUMENT_ITEM_DATA_FROM_MATERIALS,
    callBack,
    data
  );
};

const getDocumentItemDataFromRowMaterialApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { printHouseMaterialId: string; supplierId?: string }
) => {
  let url = `${GET_DOCUMENT_ITEM_DATA_FROM_ROW_MATERIAL}/${data.printHouseMaterialId}`;
  if (data.supplierId) {
    url += `?supplierId=${data.supplierId}`;
  }
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    url,
    callBack
  );
};

const toggleMaterialTypeActiveApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    TOGGLE_MATERIAL_TYPE_ACTIVE_URL,
    callBack,
    data
  );
};

const getGroupedMaterialTypesApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_GROUPED_MATERIAL_TYPES_URL,
    setState
  );
};

const uploadDocumentAttachmentApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPLOAD_DOCUMENT_ATTACHMENT,
    callBack,
    data
  );
};

const uploadQuoteItemFileForDocumentApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPLOAD_QUOTE_ITEM_FILE,
    callBack,
    data
  );
};

const removeQuoteItemFileApi: ICallAndSetData = async (   
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE, 
    REMOVE_QUOTE_ITEM_FILE,
    callBack,
    data
  );
};


const uploadQuoteItemFileApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    data?.uri,
    callBack,
    {
      documentId: data?.documentId,
      fileName: data?.fileName,
      base64Content: data?.base64Content,
    }
  );
};

const deletePrintHouseMaterialRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  id: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${DELETE_PRINTHOUSE_MATERIAL_ROW_URL}/${id}`,
    callBack
  );
};

const deleteMaterialProductApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { id: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    DELETE_MATERIAL_PRODUCT_URL,
    callBack,
    { id: data.id }
  );
};

const addMaterialProductApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: { id: string; body?: any }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_MATERIAL_PRODUCT_URL,
    callBack,
    { id: data.id, ...(data.body || {}) }
  );
};

export {
  getMaterialsTypesApi,
  getMaterialTableHeadersApi,
  getMaterialExcelFileApi,
  uploadMaterialExcelFileApi,
  updateMaterialsImagesApi,
  getMaterialCategoriesApi,
  getMaterialCategoryByMaterialKeyApi,
  getMaterialCategoryDataApi,
  updateMaterialPropApi,
  updateMaterialsPropApi,
  addMaterialCategoryApi,
  addMaterialCategoryRowApi,
  deleteMaterialCategoryApi,
  deleteMaterialCategoryRowApi,
  getDeviceSizeMockApi,
  createPurchaseOrderApi,
  createDieCutFromTemplateMakerApi,
  uploadPrintHouseMaterialApi,
  addDocumentItemFromMaterialRowApi,
  getDocumentItemDataFromMaterialApi,
  getDocumentItemDataFromRowMaterialApi,
  updateMaterialCategoryNumberingApi,
  updateSupplierPriorityApi,
  toggleMaterialTypeActiveApi,
  getGroupedMaterialTypesApi,
  uploadDocumentAttachmentApi,
  uploadQuoteItemFileApi,
  uploadQuoteItemFileForDocumentApi,
  removeQuoteItemFileApi,
  deletePrintHouseMaterialRowApi,
  deleteMaterialProductApi,
  addMaterialProductApi
};
