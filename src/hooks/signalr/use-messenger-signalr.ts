import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import config from "@/config";
import {getUserToken} from "@/services/storage-data";
import {useEffect} from "react";

const useMessengerSignalr = () => {
    const {connection, connectionId} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/messenger',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            console.log(connectionId);
            connection.on('NotifyQuickBloxUser', () => {
                alert('update')
            })
        }
    }, [connection, connectionId])
    return {
    }
}

export {useMessengerSignalr}