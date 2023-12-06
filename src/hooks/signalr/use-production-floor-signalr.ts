import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";

const useProductionFloorSignalr = () => {
    const {data,connectionId} = useGoMakeSignalr<IBordMission[]>({
        url: "http://gomake-erp-service-dev.eu-west-3.elasticbeanstalk.com" + '/hubs/boardMissions',
        accessToken: getUserToken(),
        methodName: "AddBoardMissions"
    })
    return {
        data,connectionId
    }
};
export {useProductionFloorSignalr}

