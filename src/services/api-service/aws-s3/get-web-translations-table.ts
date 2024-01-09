import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_TRANSLATIONS_TABLE_URL = '/v1/S3-aws/get-web-translations-table';

const getWebTranslationsTable: ICallAndSetData = async (callApi, setState, page) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_TRANSLATIONS_TABLE_URL, setState, page);
}

export { getWebTranslationsTable };