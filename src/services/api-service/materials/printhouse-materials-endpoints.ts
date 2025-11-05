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
const ADD_PRINTHOUSE_MATERIAL_ROW_URL =
  "/v1/printhouse-materials/add-printhouse-material-row";
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
const DOWNLOAD_MATERIAL_ROW_EXCEL_FILE =
  "/v1/printhouse-materials/download-material-row-excel";
const UPLOAD_MATERIAL_1_ROW_EXCEL_FILE =
  "/v1/printhouse-materials/upload-material-one-row-excel";


const GET_MATERIALS_SIZES_URL = "/v1/printhouse-materials/get-materials-sizes";
const GET_SUPPLIER_INVENTORIES_URL = "/v1/printhouse-materials/get-supplier-inventories";
const GET_PURCHASE_PRICING_URL = "/v1/printhouse-materials/get-purchase-pricing";

// New supplier inventory management endpoints
const GET_SUPPLIER_INVENTORY_USAGE_URL = "/v1/printhouse-materials/get-supplier-inventory-usage";
const DELETE_SUPPLIER_INVENTORY_URL = "/v1/printhouse-materials/delete-supplier-inventory";
const DELETE_PRINTHOUSE_MATERIAL_SUPPLIER_URL = "/v1/printhouse-materials/delete-print-house-material-supplier";
const REORDER_PRINTHOUSE_MATERIALS_URL = "/v1/printhouse-materials/reorder-print-house-materials";
const REORDER_PRINTHOUSE_SUPPLIER_INVENTORIES_URL = "/v1/printhouse-materials/reorder-supplier-inventories";
const REORDER_PRINTHOUSE_MATERIAL_SUPPLIER_URL = "/v1/printhouse-materials/reorder-print-house-material-supplier";
const UPDATE_SUPPLIER_INVENTORY_URL = "/v1/printhouse-materials/update-supplier-inventory";
const ADD_SUPPLIER_INVENTORY_URL = "/v1/printhouse-materials/add-supplier-inventory";
const UPDATE_PRINT_HOUSE_MATERIAL_ROW_URL = "/v1/printhouse-materials/update-print-house-material-row";
const UPDATE_PRINT_HOUSE_MATERIALS_ROWS_URL = "/v1/printhouse-materials/update-print-house-materials-rows";
const UPDATE_PRINT_HOUSE_MATERIAL_SUPPLIER_URL = "/v1/printhouse-materials/update-print-house-material-supplier";
const ADD_PRINT_HOUSE_MATERIAL_SUPPLIER_URL = "/v1/printhouse-materials/add-print-house-material-supplier";
const UPDATE_SUPPLIER_INVENTORIES_ACTION_URL = "/v1/printhouse-materials/update-supplier-inventories-action";
const UPDATE_PRINTHOUSE_MATERIAL_SUPPLIERS_ACTION_URL = "/v1/printhouse-materials/update-printhouse-material-suppliers-action";
const CALCULATE_PRICE_URL = "/v1/printhouse-materials/calculate-price";

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

const addPrintHouseMaterialRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_PRINTHOUSE_MATERIAL_ROW_URL,
    callBack,
    data
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

const getPrintHouseMaterialRowExcelFileApi: ICallAndSetData = async (
  callApi,
  setState,
  materialKey: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${DOWNLOAD_MATERIAL_ROW_EXCEL_FILE}/${materialKey}`,
    setState
  );
};

const uploadPrintHouseMaterial1RowExcelFileApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPLOAD_MATERIAL_1_ROW_EXCEL_FILE,
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

// New supplier inventory management API functions
const getSupplierInventoryUsageApi: ICallAndSetData = async (
  callApi,
  setState,
  supplierInventoryId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_SUPPLIER_INVENTORY_USAGE_URL}/${supplierInventoryId}`,
    setState
  );
};

const deleteSupplierInventoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  supplierInventoryId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${DELETE_SUPPLIER_INVENTORY_URL}/${supplierInventoryId}`,
    callBack
  );
};

const deletePrintHouseMaterialSupplierApi: ICallAndSetData = async (
  callApi,
  callBack,
  printHouseMaterialSupplierId: string
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.DELETE,
    `${DELETE_PRINTHOUSE_MATERIAL_SUPPLIER_URL}/${printHouseMaterialSupplierId}`,
    callBack
  );
};

const reorderPrintHouseMaterialsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    REORDER_PRINTHOUSE_MATERIALS_URL,
    callBack,
    data
  );
};

const reorderPrintHouseMaterialSupplierApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    REORDER_PRINTHOUSE_MATERIAL_SUPPLIER_URL,
    callBack,
    data
  );
};

const reorderPrintHouseSupplierInventoriesApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    REORDER_PRINTHOUSE_SUPPLIER_INVENTORIES_URL,
    callBack,
    data
  );
};

const updateSupplierInventoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_SUPPLIER_INVENTORY_URL,
    callBack,
    data
  );
};

const addSupplierInventoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_SUPPLIER_INVENTORY_URL,
    callBack,
    data
  );
};

const updatePrintHouseMaterialRowApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PRINT_HOUSE_MATERIAL_ROW_URL,
    callBack,
    data
  );
};

const updatePrintHouseMaterialsRowsApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PRINT_HOUSE_MATERIALS_ROWS_URL,
    callBack,
    data
  );
};

const updatePrintHouseMaterialSupplierApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_PRINT_HOUSE_MATERIAL_SUPPLIER_URL,
    callBack,
    data
  );
};

const addPrintHouseMaterialSupplierApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    printHouseMaterialId: string;
    supplierId: string;
    price: number;
    currency: string;
    isActive: boolean;
    stock: number;
    quantity: number;
    supplementTime: number;
    existingSupplierAction: number;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_PRINT_HOUSE_MATERIAL_SUPPLIER_URL,
    callBack,
    data
  );
};

const updateSupplierInventoriesActionApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_SUPPLIER_INVENTORIES_ACTION_URL,
    callBack,
    data
  );
};

const updatePrintHouseMaterialSuppliersActionApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: any
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    UPDATE_PRINTHOUSE_MATERIAL_SUPPLIERS_ACTION_URL,
    callBack,
    data
  );
};

const calculatePriceApi: ICallAndSetData = async (
  callApi,
  callBack,
  data: {
    printHouseMaterialId: string;
    price: number;
    currency: string;
    priceIndex: number;
    exchangeRate: number;
    key: string;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.PUT,
    CALCULATE_PRICE_URL,
    callBack,
    data
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
  addPrintHouseMaterialRowApi,
  deletePrintHouseMaterialCategoryRowApi,
  getMaterialsSizesApi,
  getPrintHouseMaterialExcelFileApi,
  uploadPrintHouseMaterialExcelFileApi,
  getPrintHouseMaterialRowExcelFileApi,
  uploadPrintHouseMaterial1RowExcelFileApi,
  updatePrintHouseMaterialCategoryNameApi,
  duplicatePrintHouseMaterialDisplayNameApi,
  updatePrintHouseCategoriesOrderApi,
  updateCategoriesOrderApi,
  getSupplierInventoriesApi,
  getPurchasePricingApi,
  // New supplier inventory management APIs
  getSupplierInventoryUsageApi,
  deleteSupplierInventoryApi,
  deletePrintHouseMaterialSupplierApi,
  reorderPrintHouseMaterialsApi,
  reorderPrintHouseMaterialSupplierApi,
  reorderPrintHouseSupplierInventoriesApi,
  updateSupplierInventoryApi,
  addSupplierInventoryApi,
  // New material row update APIs
  updatePrintHouseMaterialRowApi,
  updatePrintHouseMaterialsRowsApi,
  updatePrintHouseMaterialSupplierApi,
  addPrintHouseMaterialSupplierApi,
  // New supplier action APIs
  updateSupplierInventoriesActionApi,
  updatePrintHouseMaterialSuppliersActionApi,
  // Price calculation API
  calculatePriceApi
};
