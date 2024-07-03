import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const PAYMENT_URL = '/v1/erp-service/pay/send-document-to-client-for-payment';
const GET_PRE_PAYMENT_BY_ID_URL = '/v1/erp-service/pay/get-pre-payment-by-id';
const SEND_PRE_PAYMENT_TO_CLIENT_URL = '/v1/erp-service/pay/send-pre-payment-to-client';
const COPY_PRE_PAYMENT_LINK_URL = '/v1/erp-service/pay/copy-pre-payment-link';


const sendDocumentToClientForPaymentApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, PAYMENT_URL, setState , data)
}

const getPrePaymentByIdApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_PRE_PAYMENT_BY_ID_URL, setState , data)
}

const sendPrePaymentToClientApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SEND_PRE_PAYMENT_TO_CLIENT_URL, setState, data);
}

const CopyPrePaymentLinkApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, COPY_PRE_PAYMENT_LINK_URL, setState, data);
}

export {
    sendDocumentToClientForPaymentApi,
    getPrePaymentByIdApi,
    sendPrePaymentToClientApi,
    CopyPrePaymentLinkApi
};