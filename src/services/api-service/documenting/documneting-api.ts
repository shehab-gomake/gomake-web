import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";
const GET_ALL_DOCUMENT_NUMBERING_URL = '/v1/crm-service/settings/documenting/get-all-document-numbering';

const getAllDocumentNumberingApi: ICallAndSetData = async (callApi, setState) => {
    return  await getSetApiData(callApi, EHttpMethod.GET, GET_ALL_DOCUMENT_NUMBERING_URL, setState)
}

export {getAllDocumentNumberingApi};