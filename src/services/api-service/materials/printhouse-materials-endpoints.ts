import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { IDynamicRowData } from "@/widgets/materials-widget/interface";

const GET_MATERIAL_CATEGORIES_URL = "/v1/printhouse-materials/GetPrintHouseMaterialCategories";
const GET_MATERIAL_CATEGORY_DATA_URL = "/v1/printhouse-materials/GetPrintHouseMaterialCategoryData";
const UPDATE_MATERIAL_PROPS_URL = "/v1/printhouse-materials/updatePrintHouseMaterial";
const UPDATE_MATERIALS_PROPS_URL = "/v1/printhouse-materials/updatePrintHouseMaterials";
const DOWNLOAD_MATERIAL_EXCEL_FILE = "/v1/printhouse-materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE = "/v1/printhouse-materials/upload-material-excel-file";
const ADD_MATERIAL_CATEGORY_URL = "/v1/printhouse-materials/add-material-category";
const DELETE_MATERIAL_CATEGORY_URL = "/v1/printhouse-materials/delete-material-category";
const ADD_MATERIAL_CATEGORY_ROW_URL = "/v1/printhouse-materials/add-material-category-row";
const DELETE_MATERIAL_CATEGORY_Row_URL =
  "/v1/materials/delete-material-category-row";


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
  }
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    `${GET_MATERIAL_CATEGORY_DATA_URL}?materialKey=${material.materialKey}&categoryKey=${material.categoryKey}&supplierId=${material.supplierId}&pageNumber=${material.pageNumber}&pageSize=${material.pageSize}&isActive=${material.isActive}`,
    setState
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

export {
      getPrintHouseMaterialCategoriesApi,
      getPrintHouseMaterialCategoryDataApi,
      updatePrintHouseMaterialPropApi,
      updatePrintHouseMaterialsPropApi,
      addPrintHouseMaterialCategoryApi,
      deletePrintHouseMaterialCategoryApi,
      addPrintHouseMaterialCategoryRowApi,
      deleteMaterialCategoryRowApi,
};
