import {useEffect, useState} from "react";
import io from "socket.io-client";
import config from "@/config";
import {useRecoilState, useRecoilValue} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";
import {isUpdateDialogsState, unreadMessagesCountState} from "@/store/unread-messages-count";
import {systemNotificationsState} from "@/store/system-notifications";
import {useGomakeAxios} from "@/hooks";
import {getUserUnreadMessagesCountApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";

const useMessengerSocketIo = () => {
    const [, setUnreadMessages] = useRecoilState(unreadMessagesCountState);
    const [, setNotifications] = useRecoilState(systemNotificationsState);
    const {callApi} = useGomakeAxios();
    const [updateState, setUpdateState] = useRecoilState<boolean>(isUpdateDialogsState);
    useEffect(() => {
        const socket = io(config.api_server);
        socket.on(`NotifyQuickBloxUser`, () => {
            setUpdateState(true);
            getUserUnreadMessagesCountApi(callApi, res => {
                if (res.success) {
                    setUnreadMessages(res.data?.total);
                }
            }).then()
        });
        socket.on(`SendNotification`, (newNotification) => {
            setNotifications(prev => [...prev, newNotification]);
        });
        return () => {
            console.log("Closing socket connection...");
            socket.disconnect();
        };
    }, []);

    return {
        updateState, setUpdateState
    };
};

export { useMessengerSocketIo };