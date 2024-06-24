import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const SEND_MSG_URL = '/v1/administrator/update-machine';
const CLEAR_CHATBOT_MESSAGES_URL = '/v1/erp-service/chat-bot/clear-chat';

const sendMsgApi: ICallAndSetData = async (callApi, setState, msg: string) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SEND_MSG_URL, setState, {message: msg});
}
const clearChatData: ICallAndSetData = async (callApi,setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, CLEAR_CHATBOT_MESSAGES_URL, setState, null);
}
export {clearChatData};