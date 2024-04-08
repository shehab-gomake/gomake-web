import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";

const useProductionFloorSignalr = () => {
    const {data,connectionId} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissions"
    })
    return {
        data,connectionId
    }
};
export {useProductionFloorSignalr}

