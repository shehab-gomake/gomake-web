import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const UPDATE_TRANSLATIONS_FILES_URL = '/v1/S3-aws/update-translation-files';

const updateTranslationFilesApi: ICallAndSetData = async (callApi, setState, TranslationFiles) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_TRANSLATIONS_FILES_URL, setState, TranslationFiles);
}

export { updateTranslationFilesApi };