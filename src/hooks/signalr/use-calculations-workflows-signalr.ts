import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";
import {useEffect, useState} from "react";

const useCalculationsWorkFlowsSignalr = () => {
    const {data,connection,connectionId} = useGoMakeSignalr<any>({
        url: 'https://calculation-service.gomake-dev.net/hubs/workFlows',
        accessToken: getUserToken(),
        methodName: "updateWorkFlows"
    })
    const [calculationSessionId,setConnectionSessionId] = useState<string>();
    useEffect(()=>{
        if(connection){
            connection.on("startCalculationSession", (newData) => {
                debugger;
                setConnectionSessionId(newData);
            });
        }
    },[connection])
    return {
        calculationResult:data,connectionId,calculationSessionId
    }
};
export {useCalculationsWorkFlowsSignalr}

