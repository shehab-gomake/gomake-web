import {useEffect, useState} from 'react';
import {QBConfig} from "@/widgets/messenger/QB-config";
import {useGomakeAxios} from "@/hooks";
import {
    getCustomerQuickBloxSessionApi,
    getQuickBloxSessionApi
} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {useRouter} from "next/router";

const useInitQuickBlox = () => {
    const [QB, setQB] = useState(null);
    const {callApi} = useGomakeAxios();
    const [sessionUser, setSessionUser] = useState<{ userId: number, password: string }>(null);
    const [isChatConnected, setIsChatConnected] = useState<boolean>(false);
    const {query, pathname} = useRouter();
    const {clientId} = query;
    const callBack = (res) => {
        if (res.success) {
            setSessionUser({userId: +res?.data?.userId, password: res?.data?.token});
        }
    }
    const getQuickBloxSession = async () => {
        await getQuickBloxSessionApi(callApi, callBack);
    }
    const getCustomerQuickBloxSession = async (client: string) => {
        await getCustomerQuickBloxSessionApi(callApi, callBack, client);
    }

    useEffect(() => {
        if (pathname === '/messenger/client/[clientId]') {
            if (!!clientId) {
                getCustomerQuickBloxSession(clientId?.toString()).then()
            }
        } else {
            getQuickBloxSession().then()
        }
    }, [pathname, clientId])


    useEffect(() => {
        if (sessionUser?.userId) {
            if (typeof window !== 'undefined') {
                import('quickblox').then((QuickBlox) => {
                    const quickBlox = QuickBlox.default;
                    quickBlox.init(QBConfig.credentials.appId, QBConfig.credentials.authKey, QBConfig.credentials.authSecret, QBConfig.credentials.accountKey, {debug: true});
                    quickBlox?.startSessionWithToken(sessionUser.password, () => {
                    });
                    quickBlox.chat.connect(sessionUser, async function (errorConnect: any) {
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
            QB.getSession(function (error) {
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