import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const UPDATE_TRANSLATIONS_TABLE_URL =
  "/v1/S3-aws/update-web-translations-table";
const ADD_NEW_LANGUAGE_URL = "/v1/excel-translations/add-new-language";
const GET_LANGS_FOR_JSON_EDITOR_URL =
  "/v1/excel-translations/get-langs-for-json-editor";

const updateWebTranslationsTable: ICallAndSetData = async (
  callApi,
  setState,
  data
) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    UPDATE_TRANSLATIONS_TABLE_URL,
    setState,
    data
  );
};

const addNewLanguageApi: ICallAndSetData = async (callApi, setState, data) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.POST,
    ADD_NEW_LANGUAGE_URL,
    setState,
    data
  );
};

const getLangsForJsonEditorApi: ICallAndSetData = async (callApi, setState) => {
  return await getSetApiData(
    callApi,
    EHttpMethod.GET,
    GET_LANGS_FOR_JSON_EDITOR_URL,
    setState
  );
};

export {
  updateWebTranslationsTable,
  addNewLanguageApi,
  getLangsForJsonEditorApi,
};
