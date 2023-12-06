import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";

const useProductionFloorSignalr = () => {
    const {data} = useGoMakeSignalr<IBordMission[]>({
        url: config.erp_server + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissions"
    })
    return {
        data
    }
};
export {useProductionFloorSignalr}

