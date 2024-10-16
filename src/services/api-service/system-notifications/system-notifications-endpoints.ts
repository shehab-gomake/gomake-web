import {ICallAndSetData} from "@/services/api-service/interface";
import {getSetApiData} from "@/services/api-service/get-set-api-data";
import {EHttpMethod} from "@/services/api-service/enums";

const GET_UNREAD_NOTIFICATIONS_URL = '/v1/erp-service/system-notifications/get-unread-notifications';
const MARK_ALL_NOTIFICATIONS_AS_READ_URL = '/v1/erp-service/system-notifications/mark-all-as-read';
const MARK_NOTIFICATION_AS_READ_BY_ID_URL = '/v1/erp-service/system-notifications/mark-as-read-by-id/';

const getUnreadNotificationsApi: ICallAndSetData = async (callApi, setState) => {
    return await getSetApiData(callApi, EHttpMethod.GET, GET_UNREAD_NOTIFICATIONS_URL, setState);
}

const markAllNotificationsAsReadApi: ICallAndSetData = async (callApi, setState ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, MARK_ALL_NOTIFICATIONS_AS_READ_URL, setState );
}
const markNotificationAsReadByIdApi: ICallAndSetData = async (callApi, setState, data ) => {
    return await getSetApiData(callApi, EHttpMethod.GET, MARK_NOTIFICATION_AS_READ_BY_ID_URL + data, setState );
}


export {getUnreadNotificationsApi, markAllNotificationsAsReadApi, markNotificationAsReadByIdApi}
