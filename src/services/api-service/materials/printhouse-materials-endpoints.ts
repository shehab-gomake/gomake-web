import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  IDynamicRowData,
  IMaterialTableFilteringValue,
} from "@/widgets/materials-widget/interface";

const GET_MATERIAL_CATEGORIES_URL =
  "/v1/printhouse-materials/GetPrintHouseMaterialCategories";
const GET_MATERIAL_CATEGORY_DATA_URL =
  "/v1/printhouse-materials/GetPrintHouseMaterialCategoryData";
const GET_MATERIAL_CATEGORY_DATA_NEW_URL =
  "/v1/printhouse-materials/get-print-house-material-category-data-new";
const UPDATE_MATERIAL_PROPS_URL =
  "/v1/printhouse-materials/updatePrintHouseMaterial";
const UPDATE_MATERIALS_PROPS_URL =
  "/v1/printhouse-materials/updatePrintHouseMaterials";
const ADD_MATERIAL_CATEGORY_URL =
  "/v1/printhouse-materials/add-printhouse-material-category";
const UPDATE_MATERIAL_CATEGORY_ORDER_URL =
  "/v1/printhouse-materials/update-print-house-categories-order";
const UPDATE_MATERIAL_ORDER_FOR_CATEGORY_URL =
  "/v1/materials/update-categories-order";
const DELETE_MATERIAL_CATEGORY_URL =
  "/v1/printhouse-materials/delete-printhouse-material-category";
const ADD_MATERIAL_CATEGORY_ROW_URL =
  "/v1/printhouse-materials/add-printhouse-material-category-row";
const UPDATE_MATERIAL_CATEGORY_CATEGORY_NAME_URL =
  "/v1/printhouse-materials/update-print-house-material-category-name";
const DUPLICATE_MATERIAL_CATEGORY_URL =
  "/v1/printhouse-materials/duplicate-print-house-material-category";

const DELETE_MATERIAL_CATEGORY_Row_URL =
  "/v1/printhouse-materials/delete-printhouse-material-category-row";
const DOWNLOAD_MATERIAL_EXCEL_FILE =
  "/v1/printhouse-materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE =
  "/v1/printhouse-materials/upload-material-excel-file";

const GET_MATERIALS_SIZES_URL = "/v1/printhouse-materials/get-materials-sizes";
const GET_SUPPLIER_INVENTORIES_URL = "/v1/printhouse-materials/get-supplier-inventories";
const GET_PURCHASE_PRICING_URL = "/v1/printhouse-materials/get-purchase-pricing";

const getPrintHouseMaterialCategoriesApi: ICallAndSetData = async (
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
const getPrintHouseMaterialCategoryDataApi: ICallAndSetData = async (
  callApi,
  setState,
  material: {
    materialKey: string;
    categoryKey: string;
    supplierId: string;
    pageNumber: number;
    pageSize: number;
    isActive: boolean;
    customFiltersKeyValueList: IMaterialTableFilteringValue[];
  },
  lock: boolean,
  abortController: AbortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_MATERIAL_CATEGORY_DATA_URL,
    setState,
    material,
    lock,
    abortController
  );
};

const getPrintHouseMaterialCategoryDataNewApi: ICallAndSetData = async (
  callApi,
  setState,
  material: {
    materialKey: string;
    categoryKey: string;
    supplierId: string;
    pageNumber: number;
    pageSize: number;
    isActive: boolean;
    customFiltersKeyValueList: IMaterialTableFilteringValue[];
  },
  lock: boolean,
  abortController: AbortController
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_MATERIAL_CATEGORY_DATA_NEW_URL,
    setState,
    material,
    lock,
    abortController
  );
};  
const updatePrintHouseMaterialPropApi: ICallAndSetData = async (
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

const updatePrintHouseMaterialsPropApi: ICallAndSetData = async (
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
const addPrintHouseMaterialCategoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  category: { materialTypeKey: string; categoryKey: string; imageBase64: any }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_MATERIAL_CATEGORY_URL,
    callBack,
    category
  );
};

const updatePrintHouseCategoriesOrderApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIAL_CATEGORY_ORDER_URL,
    callBack,
    data
  );
};

const updateCategoriesOrderApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIAL_ORDER_FOR_CATEGORY_URL,
    callBack,
    data
  );
};

const deletePrintHouseMaterialCategoryApi: ICallAndSetData = async (
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

const addPrintHouseMaterialCategoryRowApi: ICallAndSetData = async (
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

const updatePrintHouseMaterialCategoryNameApi: ICallAndSetData = async (
  callApi,
  callBack,
  row: {
    materialTypeKey: string;
    categoryKey: string;
    displayName: string;
    defaultAttributeValues: {
      attributeName: string;
      value: string;
    }[];
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_MATERIAL_CATEGORY_CATEGORY_NAME_URL,
    callBack,
    row
  );
};

const duplicatePrintHouseMaterialDisplayNameApi: ICallAndSetData = async (
  callApi,
  callBack,
  row: {
    materialTypeKey: string;
    categoryKey: string;
    newCategoryKey: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    DUPLICATE_MATERIAL_CATEGORY_URL,
    callBack,
    row
  );
};

const deletePrintHouseMaterialCategoryRowApi: ICallAndSetData = async (
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

const getMaterialsSizesApi: ICallAndSetData = async (
  callApi,
  callBack,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    GET_MATERIALS_SIZES_URL,
    callBack,
    data
  );
};
const getPrintHouseMaterialExcelFileApi: ICallAndSetData = async (
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
const uploadPrintHouseMaterialExcelFileApi: ICallAndSetData = async (
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

const getSupplierInventoriesApi: ICallAndSetData = async (
  callApi,
  setState,
  printHouseMaterialId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_SUPPLIER_INVENTORIES_URL}/${printHouseMaterialId}`,
    setState
  );
};

const getPurchasePricingApi: ICallAndSetData = async (
  callApi,
  setState,
  printHouseMaterialId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_PURCHASE_PRICING_URL}/${printHouseMaterialId}`,
    setState
  );
};
export {
  getPrintHouseMaterialCategoriesApi,
  getPrintHouseMaterialCategoryDataApi,
  getPrintHouseMaterialCategoryDataNewApi,
  updatePrintHouseMaterialPropApi,
  updatePrintHouseMaterialsPropApi,
  addPrintHouseMaterialCategoryApi,
  deletePrintHouseMaterialCategoryApi,
  addPrintHouseMaterialCategoryRowApi,
  deletePrintHouseMaterialCategoryRowApi,
  getMaterialsSizesApi,
  getPrintHouseMaterialExcelFileApi,
  uploadPrintHouseMaterialExcelFileApi,
  updatePrintHouseMaterialCategoryNameApi,
  duplicatePrintHouseMaterialDisplayNameApi,
  updatePrintHouseCategoriesOrderApi,
  updateCategoriesOrderApi,
  getSupplierInventoriesApi,
  getPurchasePricingApi,
};
