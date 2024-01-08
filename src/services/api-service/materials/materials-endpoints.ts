import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { IDynamicRowData } from "@/widgets/materials-widget/interface";

const GET_MATERIAL_CATEGORY_DATA_URL =
  "/v1/materials/GetPrintHouseMaterialCategoryData";
const GET_MATERIAL_CATEGORIES_URL = "/v1/materials/GetMaterialCategories";
const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
const GET_MATERIAL_TABLE_HEADERS_URL =
  "/v1/materials/GetMaterialTypeTableHeader";
const UPDATE_MATERIAL_PROPS_URL = "/v1/materials/updatePrintHouseMaterial";
const UPDATE_MATERIALS_PROPS_URL = "/v1/materials/updatePrintHouseMaterials";
const DOWNLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/upload-material-excel-file";
const ADD_MATERIAL_CATEGORY_URL = "/v1/materials/add-material-category";
const DELETE_MATERIAL_CATEGORY_URL = "/v1/materials/delete-material-category";
const ADD_MATERIAL_CATEGORY_ROW_URL = "/v1/materials/add-material-category-row";
const DELETE_MATERIAL_CATEGORY_Row_URL =
  "/v1/materials/delete-material-category-row";

const getMaterialCategoryDataApi: ICallAndSetData = async (
  callApi,
  setState,
  material: {
    materialKey: string;
    categoryKey: string;
    supplierId: string;
    pageNumber: number;
    pageSize: number;
    isActive: boolean;
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_MATERIAL_CATEGORY_DATA_URL}?materialKey=${material.materialKey}&categoryKey=${material.categoryKey}&supplierId=${material.supplierId}&pageNumber=${material.pageNumber}&pageSize=${material.pageSize}&isActive=${material.isActive}`,
    setState
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

const addMaterialCategoryApi: ICallAndSetData = async (
  callApi,
  callBack,
  category: { materialTypeKey: string; categoryKey: string }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_MATERIAL_CATEGORY_URL,
    callBack,
    category
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

export {
  getMaterialCategoryDataApi,
  getMaterialCategoriesApi,
  getMaterialsTypesApi,
  getMaterialTableHeadersApi,
  updateMaterialPropApi,
  updateMaterialsPropApi,
  getMaterialExcelFileApi,
  uploadMaterialExcelFileApi,
  addMaterialCategoryApi,
  deleteMaterialCategoryApi,
  addMaterialCategoryRowApi,
  deleteMaterialCategoryRowApi,
};
