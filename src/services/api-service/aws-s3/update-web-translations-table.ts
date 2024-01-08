import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const UPDATE_TRANSLATIONS_TABLE_URL = '/v1/S3-aws/update-web-translations-table';

const updateWebTranslationsTable: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, UPDATE_TRANSLATIONS_TABLE_URL, setState, data);
}

export { updateWebTranslationsTable };