import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useEffect} from "react";

const useDisplayProfitProfilesSignalr = () => {
    const {connection,} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/displayProfitProfiles',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on("Show", () => {
                console.log("Updataaaaaaaaaaaaaaaae")
            });
        }
    }, [connection]);
    return {}
};
export {useDisplayProfitProfilesSignalr}

