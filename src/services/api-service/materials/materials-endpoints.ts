import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";
import { IDynamicRowData } from "@/widgets/materials-widget/interface";

const GET_MATERIAL_CATEGORIES_URL = "/v1/materials/GetMaterialCategories";
const GET_MATERIALS_TYPES_URL = "/v1/materials/getMaterialsTypes";
const GET_MATERIAL_TABLE_HEADERS_URL =
  "/v1/materials/GetMaterialTypeTableHeader";
const DOWNLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/download-material-excel";
const UPLOAD_MATERIAL_EXCEL_FILE = "/v1/materials/upload-material-excel-file";


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


export {
  getMaterialCategoriesApi,
  getMaterialsTypesApi,
  getMaterialTableHeadersApi,
  getMaterialExcelFileApi,
  uploadMaterialExcelFileApi,
};
