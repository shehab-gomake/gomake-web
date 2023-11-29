import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getAndSetAllActionProfitRowsByActionId } from "./services/get-all-action-profit-rows-by-action-id";
import { getAndSetActionProfitByActionId } from "./services/get-action-profit-by-action-id";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetActionProfitRowChartData } from "./services/get-action-profit-row-chart-data";
import { EPricingBy, ETransition } from "./enums/profites-enum";
import { EHttpMethod } from "@/services/api-service/enums";

const useNewProfits = () => {
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const Transition = [
    {
      label: "Linear",
      value: ETransition.LINEAR,
    },
    {
      label: "Steps",
      value: ETransition.STEPS,
    },
  ];
  const PricingBy = [
    {
      label: "Cost",
      value: EPricingBy.COST,
    },
    {
      label: "Quantity",
      value: EPricingBy.QUANTITY,
    },
    {
      label: "Material Quantity",
      value: EPricingBy.MATERIAL_QUANTITY,
    },
    {
      label: "Beats",
      value: EPricingBy.BEATS,
    },
    {
      label: "M^2",
      value: EPricingBy.SQUARE_METER,
    },
    {
      label: "M^3",
      value: EPricingBy.CUBIC_METER,
    },
  ];
  const [selectedPricingBy, setSelectedPricingBy] = useState<any>({});
  const [selectedTransition, setSelectedTransition] = useState<any>({});
  const [allActionProfitRowsByActionId, setAllActionProfitRowsByActionId] =
    useState([]);

  const [actionProfitByActionId, setActionProfitByActionId] = useState<any>([]);
  const [actionProfitRowChartData, setActionProfitRowChartData] = useState<any>(
    []
  );
  const [isUpdateCost, setIsUpdateCost] = useState(null);
  console.log("FFFFFF", {
    allActionProfitRowsByActionId,
    actionProfitByActionId,
    actionProfitRowChartData,
  });
  const [tableHeaders, setTableHeaders] = useState([
    "Cost",
    "Profit",
    "Total price",
    "More",
  ]);

  const getAllActionProfitRowsByActionId = useCallback(async () => {
    await getAndSetAllActionProfitRowsByActionId(
      callApi,
      setAllActionProfitRowsByActionId,
      { actionId: router.query.actionId }
    );
  }, [router]);

  const getActionProfitByActionId = useCallback(async () => {
    await getAndSetActionProfitByActionId(callApi, setActionProfitByActionId, {
      actionId: router.query.actionId,
    });
  }, [router]);

  const getActionProfitRowChartData = useCallback(async () => {
    if (actionProfitByActionId?.id) {
      await getAndSetActionProfitRowChartData(
        callApi,
        setActionProfitRowChartData,
        {
          actionProfitId: actionProfitByActionId?.id,
        }
      );
    }
  }, [actionProfitByActionId]);

  useEffect(() => {
    getAllActionProfitRowsByActionId();
    getActionProfitByActionId();
  }, []);
  useEffect(() => {
    getActionProfitRowChartData();
  }, [actionProfitByActionId]);
  useEffect(() => {
    if (selectedPricingBy?.value === EPricingBy.COST) {
      setTableHeaders([
        selectedPricingBy?.label,
        "Profit",
        "Total price",
        "More",
      ]);
    } else {
      setTableHeaders([
        selectedPricingBy?.label,
        "Unit price",
        "Total price",
        "More",
      ]);
    }
  }, [selectedPricingBy]);
  useEffect(() => {
    let defaultPricingByValue = PricingBy.find(
      (item) => item?.value === actionProfitByActionId?.pricingBy
    );
    let defaultTransitionValue = Transition.find(
      (item) => item?.value === actionProfitByActionId?.transitionType
    );
    setSelectedPricingBy(defaultPricingByValue);
    setSelectedTransition(defaultTransitionValue);
  }, [actionProfitByActionId]);

  const updatePricingByForAction = useCallback(
    async (data: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/profits/update-action-profit`,
        {
          recordID: actionProfitByActionId?.recordID,
          id: actionProfitByActionId?.id,
          printingActionId: actionProfitByActionId?.printingActionId,
          pricingBy: data?.value,
          transitionType: actionProfitByActionId?.transitionType,
          minPrice: actionProfitByActionId?.minPrice,
          actionProfitRows: [],
          actionExpections: [],
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        setSelectedPricingBy(data);
        getAllActionProfitRowsByActionId();
      } else {
        alertFaultUpdate();
      }
    },
    [actionProfitByActionId]
  );

  const [actionProfitRowsList, setActionProfitRowsList] = useState<any>([]);
  useEffect(() => {
    setActionProfitRowsList(allActionProfitRowsByActionId);
  }, [allActionProfitRowsByActionId]);
  const changeactionProfitRowsItems = (
    index: number,
    filedName: string,
    value: any
  ) => {
    console.log("DDDDDD", {
      index,
      filedName,
      value,
      actionProfitRowsList,
    });
    let temp = [...actionProfitRowsList];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setActionProfitRowsList(temp);
  };
  return {
    allActionProfitRowsByActionId,
    actionProfitRowChartData,
    actionProfitByActionId,
    actionProfitRowsList,
    selectedTransition,
    selectedPricingBy,
    tableHeaders,
    Transition,
    PricingBy,
    router,
    updatePricingByForAction,
    setSelectedTransition,
    setSelectedPricingBy,
    changeactionProfitRowsItems,
  };
};

export { useNewProfits };
