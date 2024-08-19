import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import config from "@/config";
import {getUserToken} from "@/services/storage-data";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {unreadMessagesCountState} from "@/store/unread-messages-count";
import {getUserUnreadMessagesCountApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {useGomakeAxios} from "@/hooks";

const useMessengerSignalr = () => {
    const [, setUnreadMessages] = useRecoilState(unreadMessagesCountState);
    const {callApi} = useGomakeAxios();
    const [updateState, setUpdateState] = useState<number>(0);
    const {connection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/messenger',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on('NotifyQuickBloxUser', () => {
                setUpdateState(prevState => prevState++);
                getUserUnreadMessagesCountApi(callApi, res => {
                    if (res.success) {
                        setUnreadMessages(res.data?.total);
                    }
                }).then()
            })
        }
    }, [connection])
    return {
        updateState
    }
}

export {useMessengerSignalr}