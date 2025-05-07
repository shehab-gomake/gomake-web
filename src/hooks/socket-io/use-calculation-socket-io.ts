import { useEffect, useState } from "react";
import io from "socket.io-client";
import config from "@/config";
import {
  ICalculationSignalRResult
} from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {ICalculatedWorkFlow, IExceptionsLog} from "@/widgets/product-pricing-widget/interface";

const useCalculationSocketIO = () => {
  //let connectionId = "";
  const [connectionId, setConnectionId] = useState<any>();
  const [signalRPricingResult, setSignalRPricingResult] = useState<any>();
  const [startCalculationData, setStartCalculationData] = useState<any>();
  const [newDieCutSelect, setNewDieCutSelect] = useState<any>();
  const [signalRWorkFlows, setSignalRWorkFlows] =
      useState<ICalculationSignalRResult>();
  const [updatedSelectedWorkFlow, setUpdatedSelectedWorkFlow] =
      useState<ICalculatedWorkFlow>();
  //  const [, setIsChangePriceForEdit] = useRecoilState(isChangePriceForEditState);
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
      useState<IExceptionsLog[]>();
  const [calculationServerError, setCalculationServerErrorState] =
      useState(false);

  const [isCalculationFinished, setIsCalculationFinished] = useState(false);
  useEffect(()=>{
    const socket = io(config.api_server);
    socket.on("updateWorkFlows", (newData: ICalculationSignalRResult) => {
      setSignalRWorkFlows(newData);
    });
    socket.on("startCalculationSession", async (newData) => {
      setStartCalculationData(newData);
    });
    socket.on("updateSelectedWorkFlow", (newData) => {
      //setUpdatedSelectedWorkFlow(newData);
      //setIsChangePriceForEdit(true)
    });
    socket.on("UpdatePricing", (newData) => {
      //setSignalRPricingResult(newData);
    });
    socket.on("calculationFinished", (newData) => {
      //newData.isCalculationFinished = true;
      //setSignalRPricingResult(newData);
    });
    socket.on("calculationServerError", () => {
      //setCalculationServerErrorState(true);
    });
    socket.on('updateDieCutSelect', (newData) => {
      setNewDieCutSelect(newData)
    });
    socket.on('connect', () => {
      setConnectionId(socket.id);
    });
  
    return () => {
      console.log("Closing socket connection...");
      socket.disconnect();
    };
  },[])
  
  return {
    calculationResult: signalRWorkFlows,
    connectionId,
    startCalculationData,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
    signalRPricingResult,
    calculationServerError,
    isCalculationFinished,
    newDieCutSelect,
    setIsCalculationFinished,
  };
};

export { useCalculationSocketIO };
