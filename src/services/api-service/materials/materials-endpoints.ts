import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  IDynamicRowData,
  IMaterialTableFilteringValue,
} from "@/widgets/materials-widget/interface";

const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
const GET_MATERIAL_TABLE_HEADERS_URL =
  "/v1/materials/GetMaterialTypeTableHeader";
const DOWNLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/upload-material-excel-file";
const UPDATE_MATERIALS_IMAGES = "/v1/materials/update-materials-images";
const GET_MATERIAL_CATEGORIES_URL = "/v1/materials/GetMaterialCategories";
const getDeviceSizeMockURL = "/v1/materials/get-device-size-material";
const GET_MATERIAL_CATEGORY_DATA_URL = "/v1/materials/GetMaterialCategoryData";
const UPDATE_MATERIAL_PROPS_URL = "/v1/materials/updateMaterial";
const UPDATE_MATERIALS_PROPS_URL = "/v1/materials/updateMaterials";
const ADD_MATERIAL_CATEGORY_URL = "/v1/materials/add-material-category";
const ADD_MATERIAL_CATEGORY_ROW_URL = "/v1/materials/add-material-category-row";
const DELETE_MATERIAL_CATEGORY_URL = "/v1/materials/delete-material-category";
const DELETE_MATERIAL_CATEGORY_Row_URL =
  "/v1/materials/delete-material-category-row";

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

const getDeviceSizeMockApi: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
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

export {
  getMaterialsTypesApi,
  getMaterialTableHeadersApi,
  getMaterialExcelFileApi,
  uploadMaterialExcelFileApi,
  updateMaterialsImagesApi,
  getMaterialCategoriesApi,
  getMaterialCategoryDataApi,
  updateMaterialPropApi,
  updateMaterialsPropApi,
  addMaterialCategoryApi,
  addMaterialCategoryRowApi,
  deleteMaterialCategoryApi,
  deleteMaterialCategoryRowApi,
  getDeviceSizeMockApi
};
