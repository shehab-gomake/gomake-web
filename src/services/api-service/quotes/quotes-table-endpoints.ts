import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_QUOTE_PDF_URL = '/v1/erp-service/quote/get-quote-pdf';

const getQuotePdfApi: ICallAndSetData = async (callApi, setState, data: {quoteId: string}) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_QUOTE_PDF_URL, setState, data);
}

export {getQuotePdfApi}
