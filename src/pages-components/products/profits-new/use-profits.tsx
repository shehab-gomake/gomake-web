import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";

import { getAndSetAllActionProfitRowsByActionId } from "./services/get-all-action-profit-rows-by-action-id";
import { getAndSetActionProfitRowChartData } from "./services/get-action-profit-row-chart-data";
import { getAndSetActionProfitByActionId } from "./services/get-action-profit-by-action-id";
import { EPricingBy, ETransition, ETypeException } from "./enums/profites-enum";
import {
  ActionProfit,
  ActionProfitRowChartData,
  ProfitsPricingTables,
  SelectedPricingByType,
  SelectedTransition,
} from "./interface";
import { getAndSetProfitsPricingTables } from "./services/get-action-profit-by-action-id copy";

const useNewProfits = () => {
  const {
    alertFaultUpdate,
    alertSuccessUpdate,
    alertSuccessAdded,
    alertFaultAdded,
  } = useSnackBar();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const Transition = [
    {
      label: t("products.profits.pricingListWidget.linear"),
      value: ETransition.LINEAR,
    },
    {
      label: t("products.profits.pricingListWidget.steps"),
      value: ETransition.STEPS,
    },
  ];
  const PricingBy = [
    {
      label: t("products.profits.pricingListWidget.cost"),
      value: EPricingBy.COST,
    },
    {
      label: t("products.profits.pricingListWidget.quantity"),
      value: EPricingBy.QUANTITY,
    },
    {
      label: t("products.profits.pricingListWidget.materialQuantity"),
      value: EPricingBy.MATERIAL_QUANTITY,
    },
    {
      label: t("products.profits.pricingListWidget.beats"),
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
  const [selectedPricingBy, setSelectedPricingBy] =
    useState<SelectedPricingByType>({
      label: "",
      value: 0,
    });
  const [selectedTransition, setSelectedTransition] =
    useState<SelectedTransition>({
      label: "",
      value: 0,
    });
  const [allActionProfitRowsByActionId, setAllActionProfitRowsByActionId] =
    useState([]);
  const [actionProfitByActionId, setActionProfitByActionId] =
    useState<ActionProfit>();
  const [actionProfitRowChartData, setActionProfitRowChartData] =
    useState<ActionProfitRowChartData>();
  const [actionProfitRowsList, setActionProfitRowsList] = useState([]);
  const [openAddStepModal, setOpenAddStepModal] = useState<boolean>(false);
  const [profitsPricingTables, setProfitsPricingTables] =
    useState<ProfitsPricingTables[]>();
  const [tableHeaders, setTableHeaders] = useState<string[]>([
    t("products.profits.pricingListWidget.cost"),
    t("products.profits.pricingListWidget.profit"),
    t("products.profits.pricingListWidget.totalPrice"),
    t("products.profits.pricingListWidget.more"),
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

  const getProfitsPricingTables = useCallback(async () => {
    await getAndSetProfitsPricingTables(callApi, setProfitsPricingTables, {
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
    getProfitsPricingTables();
  }, []);
  useEffect(() => {
    getActionProfitRowChartData();
  }, [actionProfitByActionId]);
  useEffect(() => {
    if (selectedPricingBy?.value === EPricingBy.COST) {
      setTableHeaders([
        selectedPricingBy?.label,
        t("products.profits.pricingListWidget.profit"),
        t("products.profits.pricingListWidget.totalPrice"),
        t("products.profits.pricingListWidget.more"),
      ]);
    } else {
      setTableHeaders([
        selectedPricingBy?.label,
        t("products.profits.pricingListWidget.unitPrice"),
        t("products.profits.pricingListWidget.totalPrice"),
        t("products.profits.pricingListWidget.more"),
      ]);
    }
  }, [selectedPricingBy]);

  const onCloseAddStepModal = () => {
    setOpenAddStepModal(false);
  };
  const onOpenAddStepModal = () => {
    setOpenAddStepModal(true);
  };
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
    async (data: SelectedPricingByType) => {
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
        getActionProfitRowChartData();
      } else {
        alertFaultUpdate();
      }
    },
    [actionProfitByActionId]
  );

  useEffect(() => {
    setActionProfitRowsList(allActionProfitRowsByActionId);
  }, [allActionProfitRowsByActionId]);
  const changeactionProfitRowsItems = (
    index: number,
    filedName: string,
    value: number
  ) => {
    let temp = [...actionProfitRowsList];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setActionProfitRowsList(temp);
  };

  const addNewStepForActionProfitRow = useCallback(
    async (value: number, totalPrice: number) => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/printhouse-config/action-profit-rows/add-action-profit-row`,
        {
          actionProfitId: actionProfitByActionId?.id,
          value,
          pricingBy: selectedPricingBy?.value,
          totalPrice: totalPrice,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        getAllActionProfitRowsByActionId();
        getActionProfitRowChartData();
      } else {
        alertFaultAdded();
      }
    },
    [actionProfitByActionId, selectedPricingBy]
  );

  const updateActionProfitRow = useCallback(async (data: any) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/action-profit-rows/update-action-profit-row`,
      {
        id: data?.id,
        actionProfitId: data?.actionProfitId,
        value: data?.value,
        pricingBy: data?.pricingBy,
        totalPrice: data?.totalPrice,
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
      getAllActionProfitRowsByActionId();
      getActionProfitRowChartData();
    } else {
      alertFaultUpdate();
    }
  }, []);

  const updateMinPriceForAction = useCallback(
    async (data: number) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/profits/update-action-profit`,
        {
          recordID: actionProfitByActionId?.recordID,
          id: actionProfitByActionId?.id,
          printingActionId: actionProfitByActionId?.printingActionId,
          pricingBy: actionProfitByActionId?.pricingBy,
          transitionType: actionProfitByActionId?.transitionType,
          minPrice: data,
          actionProfitRows: [],
          actionExpections: [],
        }
      );
      if (res?.success) {
        alertSuccessUpdate();
        getAllActionProfitRowsByActionId();
        getActionProfitByActionId();
      } else {
        alertFaultUpdate();
      }
    },
    [actionProfitByActionId]
  );
  const [minimumValue, setMinimumValue] = useState(0);
  useEffect(() => {
    setMinimumValue(actionProfitByActionId?.minPrice);
  }, [actionProfitByActionId]);
  const [isUpdateMinimumValue, setIsUpdateMinimumValue] = useState(null);
  const onBlurMinimumValue = async () => {
    updateMinPriceForAction(minimumValue);
    setIsUpdateMinimumValue(null);
  };
  const onInputChangeMinimumValue = (e) => {
    setMinimumValue(e);
  };

  const [anchorElPricingTables, setAnchorElPricingTables] =
    useState<null | HTMLElement>(null);
  const openPricingTables = Boolean(anchorElPricingTables);

  const handleClickPricingTables = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPricingTables(event.currentTarget);
  };
  const handleClosePricingTables = () => {
    setAnchorElPricingTables(null);
  };

  const [anchorElPricingTablesMapping, setAnchorElPricingTablesMapping] =
    useState<null | HTMLElement>(null);
  const openPricingTablesMapping = Boolean(anchorElPricingTablesMapping);

  const handleClickPricingTablesMapping = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElPricingTablesMapping(event.currentTarget);
  };
  const handleClosePricingTablesMapping = () => {
    setAnchorElPricingTablesMapping(null);
  };
  const [selectedPricingTableItems, setSelectedPricingTableItems] =
    useState<ProfitsPricingTables>();
  useEffect(() => {
    if (profitsPricingTables?.length > 0) {
      const defaultRow = profitsPricingTables?.find((item) => {
        return item.exceptionType === ETypeException.DEFAULT;
      });
      setSelectedPricingTableItems(defaultRow);
    }
  }, [profitsPricingTables]);
  const [dataForPricing, setDataForPricing] =
    useState<ProfitsPricingTables[]>();
  const [dataForExceptions, setDataForExceptions] =
    useState<ProfitsPricingTables[]>();

  const reOrderPricingTables = useCallback(async (data: any) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/profits/update-re-order-pricing-tables?actionId=${router.query.actionId}`,
      {
        data,
      }
    );
  }, []);
  useEffect(() => {
    const filteredArray = profitsPricingTables?.reduce(
      (result, item) => {
        const newArrayIndex =
          item.exceptionType === ETypeException.ADDITIONAL ? 0 : 1;

        if (!result[newArrayIndex]) {
          result[newArrayIndex] = [];
        }

        result[newArrayIndex].push(item);

        return result;
      },
      [[], []]
    );
    if (filteredArray) {
      setDataForExceptions(filteredArray[0]);
      setDataForPricing(filteredArray[1]);
    }
  }, [profitsPricingTables]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newData = Array.from(dataForPricing);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    const transformedArray = newData
      .filter((item) => item.exceptionType !== ETypeException.DEFAULT)
      .map((item, index) => ({ id: item?.id, index: index + 1 }));
    setDataForPricing(newData);
    reOrderPricingTables(transformedArray);
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
    openAddStepModal,
    minimumValue,
    isUpdateMinimumValue,
    profitsPricingTables,
    anchorElPricingTables,
    openPricingTables,
    selectedPricingTableItems,
    anchorElPricingTablesMapping,
    openPricingTablesMapping,
    dataForExceptions,
    dataForPricing,
    onDragEnd,
    setSelectedPricingTableItems,
    handleClickPricingTables,
    handleClosePricingTables,
    handleClickPricingTablesMapping,
    handleClosePricingTablesMapping,
    onBlurMinimumValue,
    setIsUpdateMinimumValue,
    onInputChangeMinimumValue,
    onCloseAddStepModal,
    onOpenAddStepModal,
    updatePricingByForAction,
    setSelectedTransition,
    setSelectedPricingBy,
    changeactionProfitRowsItems,
    addNewStepForActionProfitRow,
    updateActionProfitRow,
    updateMinPriceForAction,
  };
};

export { useNewProfits };
