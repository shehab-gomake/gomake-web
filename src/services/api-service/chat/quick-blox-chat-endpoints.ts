import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";
import {ICallAndSetData} from "@/services/api-service/interface";

const GET_USER_QUICK_BLOX_URL = '/v1/crm-service/quick-blox/get-quick-blox';
const GET_CUSTOMER_QUICK_BLOX_URL = '/v1/crm-service/quick-blox/get-client-quick-blox/';
const CREATE_CHAT_ROOM_URL = '/v1/crm-service/quick-blox/create-chat-room';
const UPDATE_APPROVAL_FILE_URL = '/v1/crm-service/quick-blox/update-approval-file-status';
const GET_USERS_META_DATA_URL = '/v1/crm-service/quick-blox/get-users-meta-data';
const CREATE_BOARD_MISSIONS_CAT_ROOM_URL = '/v1/erp-service/board-missions/create-chat-room';

const getQuickBloxSessionApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_USER_QUICK_BLOX_URL, setState)
}
const getCustomerQuickBloxSessionApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_CUSTOMER_QUICK_BLOX_URL + data, setState)
}
const createChatRoomApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, CREATE_CHAT_ROOM_URL, setState, data)
}
const updateApprovalFileApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.PUT, UPDATE_APPROVAL_FILE_URL, setState, data)
}
const getUsersMetaDataApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, GET_USERS_META_DATA_URL, setState, data)
}
const createBoardMissionsChatRoomApi: ICallAndSetData = async (callApi, setState, data) => {
    return await getSetApiData(callApi, EHttpMethod.POST, CREATE_BOARD_MISSIONS_CAT_ROOM_URL, setState, data)
}
export {
    getQuickBloxSessionApi,
    createChatRoomApi,
    updateApprovalFileApi,
    getUsersMetaDataApi,
    getCustomerQuickBloxSessionApi,
    createBoardMissionsChatRoomApi
};