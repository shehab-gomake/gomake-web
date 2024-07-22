import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import { useEffect, useState } from "react";
import { ICalculationSignalRResult } from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {
  ICalculatedWorkFlow,
  IExceptionsLog,
} from "@/widgets/product-pricing-widget/interface";
import { useGomakeAxios } from "../use-gomake-axios";
import config from "@/config";

const useCalculationsWorkFlowsSignalr = () => {

  const { data, connection, connectionId } =
    useGoMakeSignalr<ICalculationSignalRResult>({
      url: config.erp_server +`/hubs/workFlows`,
      accessToken: getUserToken(),
      methodName: "updateWorkFlows",
    });
   
  const [calculationSessionId, setConnectionSessionId] = useState<string>();
  const [signalRPricingResult, setSignalRPricingResult] = useState<any>();

  const [signalrRWorkFlows, setSignalrRWorkFlows] =
    useState<ICalculationSignalRResult>();
  const [updatedSelectedWorkFlow, setUpdatedSelectedWorkFlow] =
    useState<ICalculatedWorkFlow>();
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useState<IExceptionsLog[]>();
  const [calculationServerError,setcalculationServerErrorState]=useState(false)

  const [isCalculationFinished,setIsCalculationFinished]=useState(false)

  useEffect(() => {
    if (connection) {
      connection.on("updateWorkFlows", (newData: ICalculationSignalRResult) => {
        setCalculationExceptionsLogs(newData.exceptions);
        setSignalrRWorkFlows(newData);
      });
      connection.on("startCalculationSession", (newData) => {
        setConnectionSessionId(newData.productItemValueDraftId);
        setCalculationExceptionsLogs(newData.calculationExceptions);
      });
      connection.on("updateSelectedWorkFlow", (newData) => {
        setUpdatedSelectedWorkFlow(newData);
      });
      connection.on("UpdatePricing", (newData) => {
        setSignalRPricingResult(newData);
      });
      connection.on("calculationFinished", (newData) => {
        debugger;
        newData.isCalculationFinished = true;
        setSignalRPricingResult(newData);
      });
      connection.on("calculationServerError", () => {
        setcalculationServerErrorState(true)
      });
    }
  }, [connection]);
  return {
    calculationResult: signalrRWorkFlows,
    calculationSessionId,
    connectionId,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
    signalRPricingResult,
    calculationServerError,
    isCalculationFinished,
    setIsCalculationFinished
  };
};
export { useCalculationsWorkFlowsSignalr };
