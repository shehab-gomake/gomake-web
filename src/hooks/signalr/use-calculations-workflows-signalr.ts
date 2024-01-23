import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import {IBordMission} from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";
import {useEffect, useState} from "react";
import {
    ICalculationSignalRResult
} from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {ICalculatedWorkFlow} from "@/widgets/product-pricing-widget/interface";
import {useRecoilState} from "recoil";
import {currentCalculationConnectionId} from "@/store";

const useCalculationsWorkFlowsSignalr = () => {
    const {data,connection,connectionId} = useGoMakeSignalr<ICalculationSignalRResult>({
        url: config.erp_server + '/hubs/workFlows',
        accessToken: getUserToken(),
        methodName: "updateWorkFlows"
    })
    const [calculationSessionId,setConnectionSessionId] = useState<string>();
    const [signalrRWorkFlows,setSignalrRWorkFlows] = useState<ICalculationSignalRResult>();
    const [updatedSelectedWorkFlow,setUpdatedSelectedWorkFlow] = useState<ICalculatedWorkFlow>();
    useEffect(()=>{
        if(connection){
            connection.on("updateWorkFlows", (newData:ICalculationSignalRResult) => {
                setSignalrRWorkFlows(newData);
            });
            connection.on("startCalculationSession", (newData) => {
                setConnectionSessionId(newData.productItemValueDraftId);
            });
            connection.on("updateSelectedWorkFlow", (newData) => {
                setUpdatedSelectedWorkFlow(newData);
            });
        }
    },[connection])
    return {
        calculationResult:signalrRWorkFlows,calculationSessionId,connectionId,updatedSelectedWorkFlow
    }
};
export {useCalculationsWorkFlowsSignalr}

