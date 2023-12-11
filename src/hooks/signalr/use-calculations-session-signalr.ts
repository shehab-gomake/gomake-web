import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";

const useCalculationsSessionSignalr = () => {
    const {data,connectionId} = useGoMakeSignalr<any>({
        url: 'https://calculation-service.gomake-dev.net/hubs/workFlows',
        accessToken: getUserToken(),
        methodName: "startCalculationSession"
    })
    return {
        calculationSessionId:data,connectionId
    }
};
export {useCalculationsSessionSignalr}

