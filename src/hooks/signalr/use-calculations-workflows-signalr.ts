import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import { useCallback, useEffect, useState } from "react";
import { ICalculationSignalRResult } from "@/pages-components/products/digital-offset-price/interfaces/calculation-signalr-result";
import {
  ICalculatedWorkFlow,
  IExceptionsLog,
} from "@/widgets/product-pricing-widget/interface";
import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios } from "../use-gomake-axios";

const useCalculationsWorkFlowsSignalr = () => {
  const { callApi } = useGomakeAxios();

  const { data, connection, connectionId } =
    useGoMakeSignalr<ICalculationSignalRResult>({
      url:  "https://erp-service.gomake-dev.net/hubs/workFlows",
      accessToken: getUserToken(),
      methodName: "updateWorkFlows",
    });
    const getSendCalculationError = useCallback(
      async () => {
        const res = await callApi(
          EHttpMethod.GET,
          `/v1/erp-service/quote/send-calculation-error`,
          {
            signalRConnectionId: connectionId
          }
        );
        if (res?.success) {
          console.log("res?.success", res?.data?.data?.data);
        } else {
          console.log("!res.success", res)
  
        }
      },
      [connectionId]
    );
  const [calculationSessionId, setConnectionSessionId] = useState<string>();
  const [signalRPricingResult, setSignalRPricingResult] = useState<any>();

  const [signalrRWorkFlows, setSignalrRWorkFlows] =
    useState<ICalculationSignalRResult>();
  const [updatedSelectedWorkFlow, setUpdatedSelectedWorkFlow] =
    useState<ICalculatedWorkFlow>();
  const [calculationExceptionsLogs, setCalculationExceptionsLogs] =
    useState<IExceptionsLog[]>();
    const [calculationFinishedState,setCalculationFinishedState]=useState()

    console.log("calculationFinishedState",calculationFinishedState)

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
        setCalculationFinishedState(newData)
      });
      connection.on("calculationServerError", () => {
        getSendCalculationError()
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
