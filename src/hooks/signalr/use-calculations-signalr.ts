import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";

const useCalculationsSignalr = () => {
    const {data,connectionId} = useGoMakeSignalr<any>({
        url: 'http://gomake-calculation-service.eu-west-3.elasticbeanstalk.com/hubs/workFlows',
        accessToken: getUserToken(),
        methodName: "updateWorkFlows"
    })
    return {
        data,connectionId
    }
};
export {useCalculationsSignalr}

