import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import config from "@/config";

const useBoardMissionsSignalr = () => {
    const { connectionId , data} = useGoMakeSignalr<any>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissionsTables"
    })
    return {
        connectionId ,
        data
    }
};
export { useBoardMissionsSignalr }
