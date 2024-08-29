import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useEffect} from "react";

const useDashboardSignalr = (onUpdate: ()=>void) => {
    const {connection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/jobDashboard',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on("Update", () => {
                onUpdate();
            });


        }
    }, [connection]);
    return {}
};
export {useDashboardSignalr}

