import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";

const useBoardMissionsSignalr = () => {
    const {connectionId} = useGoMakeSignalr<any>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: ""
    })
    return {
        connectionId,
    }
};
export {useBoardMissionsSignalr}
