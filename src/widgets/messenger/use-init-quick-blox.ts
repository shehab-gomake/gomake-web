import {useEffect, useState} from 'react';
import {QBConfig} from "@/widgets/messenger/QB-config";
import {useGomakeAxios} from "@/hooks";
import {getQuickBloxSessionApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";

const useInitQuickBlox = () => {
    const [QB, setQB] = useState(null);
    const {callApi} = useGomakeAxios();
    const [sessionUser, setSessionUser] = useState<{ userId: number, password: string }>(null);
    const [isChatConnected, setIsChatConnected] = useState<boolean>(false);
    const getQuickBloxSession = async () => {
        const callBack = (res) => {
            if (res.success) {
                setSessionUser({userId: +res?.data?.userId, password: res?.data?.token});
            }
        }
        await getQuickBloxSessionApi(callApi, callBack);
    }

    useEffect(() => {
        getQuickBloxSession().then()
    }, [])


    useEffect(() => {
        if (sessionUser?.userId) {
            if (typeof window !== 'undefined') {
                import('quickblox').then((QuickBlox) => {
                    const quickBlox = QuickBlox.default;
                    quickBlox.init(QBConfig.credentials.appId, QBConfig.credentials.authKey, QBConfig.credentials.authSecret, QBConfig.credentials.accountKey, {debug: true});
                    quickBlox?.startSessionWithToken(sessionUser.password, () => {
                    });
                    quickBlox.chat.connect(sessionUser, async function (errorConnect: any, resultConnect: any) {
                        if (!errorConnect) {
                            setQB(quickBlox);
                        }
                    });
                });
            }
        }
    }, [sessionUser]);

    useEffect(() => {
        if (QB) {
            QB.getSession(function (error, session) {
                if (error) {
                    setIsChatConnected(false)
                } else {
                    setIsChatConnected(true)
                }
            })
        }
    }, [QB])

    return {QB, sessionUser, isChatConnected};
};

export {useInitQuickBlox};