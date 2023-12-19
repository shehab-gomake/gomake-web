import { ICallAndSetData } from "@/services/api-service/interface";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { EHttpMethod } from "@/services/api-service/enums";

const DOWNLOAD_TRANSLATIONS_EXCEL_FILE = '/v1/S3-aws/download-translations-excel-file'
const UPLOAD_TRANSLATIONS_EXCEL_FILE = '/v1/S3-aws/upload-translations-excel-file';

const getTranslationsExcelFileApi: ICallAndSetData = async (callApi, callBack) => {
    return await getSetApiData(callApi, EHttpMethod.GET, DOWNLOAD_TRANSLATIONS_EXCEL_FILE, callBack);
}
 
const uploadTranslationsExcelFileApi: ICallAndSetData = async (callApi, callBack, data: { base64: string }) => {
    return await getSetApiData(callApi,
        EHttpMethod.POST,
        UPLOAD_TRANSLATIONS_EXCEL_FILE,
        callBack,
        data)
}

export {getTranslationsExcelFileApi , uploadTranslationsExcelFileApi}