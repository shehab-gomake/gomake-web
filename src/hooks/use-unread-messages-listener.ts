import {useEffect} from "react";
import {useQuickBlox} from "@/widgets/messenger/use-quick-blox";
import {useRecoilState} from "recoil";
import {unreadMessagesCountState} from "@/store/unread-messages-count";
import {getUserUnreadMessagesCountApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {useGomakeAxios} from "@/hooks/use-gomake-axios";

const useUnreadMessagesListener = () => {
    const messenger = useQuickBlox();
    const [, setUnreadMessage] = useRecoilState(unreadMessagesCountState);
    const {callApi} = useGomakeAxios();
    const getUnreadMessagesCount = async () => {
        const callBack = res => {
            if (res.success) {
                setUnreadMessage(res?.data?.total)
            }
        }
        await getUserUnreadMessagesCountApi(callApi, callBack);
    }
    useEffect(() => {
        if (messenger.isChatConnected) {
            messenger.listeners.onMessage((userId, message) => {
                alert('aa')
                getUnreadMessagesCount().then();
            })
        }
    }, [messenger.isChatConnected])
    return {}
}

export {useUnreadMessagesListener}