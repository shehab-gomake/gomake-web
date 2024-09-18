import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import config from "@/config";
import {getUserToken} from "@/services/storage-data";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {isUpdateDialogsState, unreadMessagesCountState} from "@/store/unread-messages-count";
import {getUserUnreadMessagesCountApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {useGomakeAxios} from "@/hooks";
import {systemNotificationsState} from "@/store/system-notifications";

const useMessengerSignalr = () => {
    const [, setUnreadMessages] = useRecoilState(unreadMessagesCountState);
    const [, setNotifications] = useRecoilState(systemNotificationsState);
    const {callApi} = useGomakeAxios();
    const [updateState, setUpdateState] = useRecoilState<boolean>(isUpdateDialogsState);
    const {connection, closeConnection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/messenger',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on('NotifyQuickBloxUser', () => {
                setUpdateState(true);
                getUserUnreadMessagesCountApi(callApi, res => {
                    if (res.success) {
                        setUnreadMessages(res.data?.total);
                    }
                }).then()
            });
            connection.on('SendNotification', (newNotification) => {
              setNotifications(prev => [...prev, newNotification]);
            })
        }
    }, [connection])
    return {
        updateState, setUpdateState, closeConnection
    }
}

export {useMessengerSignalr}