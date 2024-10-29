import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import { useEffect, useState } from "react";
import { ICalculationSignalRResult } from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {
  ICalculatedWorkFlow,
  IExceptionsLog,
} from "@/widgets/product-pricing-widget/interface";
import config from "@/config";
import { useRecoilState } from "recoil";

const useCalculationsWorkFlowsSignalR = () => {

  const { data, connection, connectionId } =
    useGoMakeSignalr<ICalculationSignalRResult>({
      url: config.erp_server +`/hubs/workFlows`,
      accessToken: getUserToken(),
      methodName: "updateWorkFlows2",
    });
   
  const [signalRPricingResult, setSignalRPricingResult] = useState<any>();
  const [startCalculationData, setStartCalculationData] = useState<any>();

  const [signalRWorkFlows, setSignalRWorkFlows] =
    useState<ICalculationSignalRResult>();
  const [updatedSelectedWorkFlow, setUpdatedSelectedWorkFlow] =
    useState<ICalculatedWorkFlow>();
  //  const [, setIsChangePriceForEdit] = useRecoilState(isChangePriceForEditState);
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useState<IExceptionsLog[]>();
  const [calculationServerError,setCalculationServerErrorState]=useState(false)

  const [isCalculationFinished,setIsCalculationFinished]=useState(false)

  useEffect(() => {
    if (connection) {
      connection.on("updateWorkFlows", (newData: ICalculationSignalRResult) => {
        //setCalculationExceptionsLogs(newData.exceptions);
        setSignalRWorkFlows(newData);
      });
      connection.on("startCalculationSession", async (newData) => {
        /*if(newData.isDevMode){
          setConnectionSessionId(newData.productItemValueDraftId);
        }*/
        setStartCalculationData(newData)
        setCalculationExceptionsLogs(newData.calculationExceptions);
      });
      connection.on("updateSelectedWorkFlow", (newData) => {
        setUpdatedSelectedWorkFlow(newData);
        //setIsChangePriceForEdit(true)
      });
      connection.on("UpdatePricing", (newData) => {
        setSignalRPricingResult(newData);
      });
      connection.on("calculationFinished", (newData) => {
        newData.isCalculationFinished = true;
        setSignalRPricingResult(newData);
      });
      connection.on("calculationServerError", () => {
        setCalculationServerErrorState(true)
      });
      
    }
  }, [connection]);


  return {
    calculationResult: signalRWorkFlows,
    connectionId,
    startCalculationData,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
    signalRPricingResult,
    calculationServerError,
    isCalculationFinished,
    setIsCalculationFinished
  };
};
export { useCalculationsWorkFlowsSignalR };
