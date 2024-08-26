import {Badge, IconButton} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {getUserUnreadMessagesCountApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useRecoilState} from "recoil";
import {unreadMessagesCountState} from "@/store/unread-messages-count";

const MessengerNotifications = () => {
    const {primaryColor} = useGomakeTheme();
    const {pathname, push} = useRouter();
    const {callApi} = useGomakeAxios();
    const [unreadMessagesCount, setUnreadMessagesCount] = useRecoilState(unreadMessagesCountState);
    const handelClick = async () => {
        await push('/messenger')
    }
    const getUnreadMessagesCount = async () => {
        const callBack = res => {
            if (res.success) {
                setUnreadMessagesCount(res?.data?.total)
            } else {

            }
        }
        await getUserUnreadMessagesCountApi(callApi, callBack);
    }
    useEffect(() => {
        getUnreadMessagesCount().then();
    }, [pathname])

    return (
        <Badge style={{padding: "2px"}} badgeContent={unreadMessagesCount} color={'warning'} invisible={unreadMessagesCount === 0}>
            <IconButton style={{padding: "5px", backgroundColor: primaryColor(300)}}
                        onClick={handelClick}>
                <EmailOutlinedIcon style={{color: '#FFF', width: 16, height: 16}}/>
            </IconButton>
        </Badge>
    );
}
export {MessengerNotifications}