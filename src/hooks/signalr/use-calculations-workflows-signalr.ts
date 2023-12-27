import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";
import {useEffect, useState} from "react";
import {
    ICalculationSignalRResult
} from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";

const useCalculationsWorkFlowsSignalr = () => {
    const {data,connection,connectionId} = useGoMakeSignalr<ICalculationSignalRResult>({
        url: config.erp_server + '/hubs/workFlows',
        accessToken: getUserToken(),
        methodName: "updateWorkFlows"
    })
    const [calculationSessionId,setConnectionSessionId] = useState<string>();
    useEffect(()=>{
        if(connection){
            connection.on("startCalculationSession", (newData) => {
                console.log("startCalculationSession",newData)
                setConnectionSessionId(newData);
            });
        }
    },[connection])
    return {
        calculationResult:data,connectionId,calculationSessionId
    }
};
export {useCalculationsWorkFlowsSignalr}

