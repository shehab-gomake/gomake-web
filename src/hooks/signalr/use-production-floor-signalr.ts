import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {useEffect} from "react";

const useProductionFloorSignalr = () => {
    const {data,connectionId, connection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: ""
    });
    const {getData} = useProductionFloorData();
    useEffect(() => {
        if (connection) {
            connection.on("UpdateBoardMissionsStation", () => {
                getData(connection?.connectionId).then();
            });
        }
    }, [connection]);

    return {
        data,connectionId
    }
};
export {useProductionFloorSignalr}

