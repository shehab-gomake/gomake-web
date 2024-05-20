import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const SEND_MSG_URL = '/v1/administrator/update-machine';

const sendMsgApi: ICallAndSetData = async (callApi, setState, msg: string) => {
    return await getSetApiData(callApi, EHttpMethod.POST, SEND_MSG_URL, setState, {message: msg});
}

export {sendMsgApi};