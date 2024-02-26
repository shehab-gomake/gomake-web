import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import { IBordMission } from "@/widgets/production-floor-widget/product-id-widget/interface";
import config from "@/config";
import { useEffect, useState } from "react";
import { ICalculationSignalRResult } from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {
  ICalculatedWorkFlow,
  IExceptionsLog,
} from "@/widgets/product-pricing-widget/interface";
import { useRecoilState } from "recoil";
import { currentCalculationConnectionId } from "@/store";

const useCalculationsWorkFlowsSignalr = () => {
  const { data, connection, connectionId } =
    useGoMakeSignalr<ICalculationSignalRResult>({
      url:  "https://erp-service.gomake-dev.net/hubs/workFlows",
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

  useEffect(() => {
    if (connection) {
      connection.on("updateWorkFlows", (newData: ICalculationSignalRResult) => {
        console.log("newData", newData);
        setCalculationExceptionsLogs(newData.exceptions);
        setSignalrRWorkFlows(newData);
      });
      connection.on("startCalculationSession", (newData) => {
        setConnectionSessionId(newData.productItemValueDraftId);
        setCalculationExceptionsLogs(newData.calculationExceptions);
        console.log("startCalculationSession", newData);
      });
      connection.on("updateSelectedWorkFlow", (newData) => {
        setUpdatedSelectedWorkFlow(newData);
      });
      connection.on("UpdatePricing", (newData) => {
        console.log("UpdatePricing", newData);
        setSignalRPricingResult(newData);
      });
    }
  }, [connection]);
  return {
    calculationResult: signalrRWorkFlows,
    calculationSessionId,
    connectionId,
    updatedSelectedWorkFlow,
    calculationExceptionsLogs,
    signalRPricingResult
  };
};
export { useCalculationsWorkFlowsSignalr };
