import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const PAYMENT_URL = '/v1/erp-service/pre-payment/send-document-to-client-for-payment';


const sendDocumentToClientForPaymentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, PAYMENT_URL, setState , data)
}


export {
    sendDocumentToClientForPaymentApi
};