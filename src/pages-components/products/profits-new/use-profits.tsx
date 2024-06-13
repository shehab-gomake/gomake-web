import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { EHttpMethod } from "@/services/api-service/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";

import { getAndSetAllActionProfitRowsByActionId } from "./services/get-all-action-profit-rows-by-action-id";
import { getAndSetActionProfitRowChartData } from "./services/get-action-profit-row-chart-data";
import { getAndSetActionProfitByActionId } from "./services/get-action-profit-by-action-id";
import {
  EPricingBy,
  EProfitRowType,
  ETransition,
  ETypeException,
} from "./enums/profites-enum";
import {
  ActionProfit,
  ActionProfitRowChartData,
  ProfitsPricingTables,
  SelectedPricingByType,
  SelectedTransition,
} from "./interface";
import { getAndSetProfitsPricingTables } from "./services/get-profits-pricing-tables";
import { getAndSetCalculateCaseProfits } from "./services/get-calculate-case-profits";
import { getAndSetProductProfitByProductId } from "./services/get-product-profit-by-product-id";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";
import { currencyUnitState } from "@/store/currency-units";
const useNewProfits = () => {
  const {
    alertFaultUpdate,
    alertSuccessUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessDelete,
    alertFaultDelete,
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

  const PricingByList = [
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
      label: t("products.profits.pricingListWidget.meter"),
      value: EPricingBy.METER,
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
  const [PricingBy, setPricingBy] = useState([])
  const modifiedPricingBy = PricingByList.slice(1);


  useEffect(() => {
    if (router.query.isOutSource) {
      setPricingBy(modifiedPricingBy)
    }
    else {
      setPricingBy(PricingByList)
    }
  }, [router])

  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);
  const [ProfitCurrency, setProfitCurrency] = useState("");
  const getCurrencyUnitText = (currency) => {
    const foundCurrency = currenciesUnits.find((c) => c.value === currency);
    if (foundCurrency) {
      return foundCurrency.text;
    } else {
      return "";
    }
  };
  useEffect(() => {
    const data = getCurrencyUnitText(systemCurrency);
    setProfitCurrency(data);
  }, [systemCurrency]);
  const [selectedPricingTableItems, setSelectedPricingTableItems] =
    useState<ProfitsPricingTables>();
  const [typeExceptionSelected, setTypeExceptionSelected] = useState<number>();
  const [selectedAdditionalProfitRow, setSelectedActionProfitRow] =
    useState<ProfitsPricingTables>();
  const [profitRowType, setProfitRowType] = useState(1);
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allActionProfitRowsByActionId, setAllActionProfitRowsByActionId] =
    useState([]);
  const [actionProfitByActionId, setActionProfitByActionId] =
    useState<ActionProfit>();
  const [calculateCaseValue, setSalculateCaseValue] = useState<any>();
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
    setIsLoading(true);
    if (actionProfitByActionId?.id) {
      const requestBody: any = {
        actionIdOrProductId: router.query.actionId
          ? router.query.actionId
          : router.query.productId,
        isOutSource: router.query.isOutSource ? true : false,
      };

      if (selectedPricingTableItems?.exceptionType != ETypeException.DEFAULT) {
        if (router.query.signalRConnectionId) {
          requestBody.exceptionId = selectedPricingTableItems?.id;
        } else {
          requestBody.exceptionId = selectedPricingTableItems?.id;
        }
      }

      const res = await getAndSetAllActionProfitRowsByActionId(
        callApi,
        setAllActionProfitRowsByActionId,
        requestBody
      );
      if (res) {
        getActionProfitRowChartData();
        setIsLoading(false);
      }
    }
  }, [
    router,
    selectedPricingTableItems,
    actionProfitByActionId,
    ETypeException,
  ]);

  useEffect(() => {
    if (router.query.signalRConnectionId) {
      getCalculateCaseProfits();
    } else {
      getAllActionProfitRowsByActionId();
    }
  }, [selectedPricingTableItems, router]);
  const getActionProfitByActionId = useCallback(async () => {
    if (router.query.productId) {
      await getAndSetProductProfitByProductId(
        callApi,
        setActionProfitByActionId,
        {
          productId: router.query.productId,
        }
      );
    } else {
      await getAndSetActionProfitByActionId(
        callApi,
        setActionProfitByActionId,
        {
          actionId: router.query.actionId,
          isOutSource: router.query.isOutSource ? true : false,
        }
      );
    }
  }, [router]);
  const getCalculateCaseProfits = useCallback(async () => {
    setIsLoading(true);
    const requestBody: any = {
      actionId: router.query.actionId,
      signalRConnectionId: router.query.signalRConnectionId,
      isOutSource: router.query.isOutSource ? true : false,
    };
    if (selectedPricingTableItems?.exceptionType != ETypeException.DEFAULT) {
      requestBody.exceptionId = selectedPricingTableItems?.id;
    }
    const res = await getAndSetCalculateCaseProfits(
      callApi,
      setSalculateCaseValue,
      requestBody,
      setIsLoading
    );
    if (res) {
      getActionProfitRowChartData();
      setIsLoading(false);
    }
  }, [router, selectedPricingTableItems]);
  const getProfitsPricingTables = useCallback(async () => {
    if (actionProfitByActionId?.id) {
      await getAndSetProfitsPricingTables(callApi, setProfitsPricingTables, {
        actionIdOrProductId: router.query.actionId
          ? router.query.actionId
          : router.query.productId,
        isOutSource: router.query.isOutSource ? true : false,
      });
    }
  }, [router, actionProfitByActionId]);

  const getActionProfitRowChartData = useCallback(async () => {
    if (actionProfitByActionId?.id) {
      const requestBody: any = {
        actionProfitId: actionProfitByActionId?.id,
      };

      if (selectedPricingTableItems?.exceptionType != ETypeException.DEFAULT) {
        requestBody.exceptionId = selectedPricingTableItems?.id;
      }
      await getAndSetActionProfitRowChartData(
        callApi,
        setActionProfitRowChartData,
        requestBody
      );
    }
  }, [actionProfitByActionId, selectedPricingTableItems]);

  useEffect(() => {
    // if (router.query.draftId) {
    //   getCalculateCaseProfits();
    // } else {
    //   getAllActionProfitRowsByActionId();
    // }
    getActionProfitByActionId();
  }, [router]);
  useEffect(() => {
    if (actionProfitByActionId?.id) {
      getProfitsPricingTables();
    }
  }, [actionProfitByActionId]);
  useEffect(() => {
    const unitPriceLabel = router.query.isOutSource
      ? t("products.profits.pricingListWidget.unitCost")
      : t("products.profits.pricingListWidget.unitPrice");

    const totalPriceLabel = router.query.isOutSource
      ? t("products.profits.pricingListWidget.totalCost")
      : t("products.profits.pricingListWidget.totalPrice");
    if (router.query.signalRConnectionId && !router.query.isOutSource) {
      setTableHeaders([
        t("products.profits.pricingListWidget.quantity"),
        `${selectedPricingBy?.label}` +
        (selectedPricingBy?.value === EPricingBy.COST
          ? ` ${ProfitCurrency}`
          : ""),
        t("products.profits.pricingListWidget.profit"),
        unitPriceLabel,
        `${totalPriceLabel} ${ProfitCurrency}`,
        t("products.profits.pricingListWidget.more"),
      ]);
      if (selectedPricingBy?.value != EPricingBy.COST) {
        setTableHeaders([
          `${selectedPricingBy?.label}` +
          (selectedPricingBy?.value === EPricingBy.COST
            ? ` ${ProfitCurrency}`
            : ""),
          t("products.profits.pricingListWidget.cost"),
          t("products.profits.pricingListWidget.profit"),
          unitPriceLabel,
          `${totalPriceLabel} ${ProfitCurrency}`,
          t("products.profits.pricingListWidget.more"),
        ]);
      }
      if (selectedAdditionalProfitRow?.id) {
        setTableHeaders([
          t("products.profits.pricingListWidget.quantity"),
          `${selectedPricingBy?.label}` +
          (selectedPricingBy?.value === EPricingBy.COST
            ? ` ${ProfitCurrency}`
            : ""),
          t("products.profits.pricingListWidget.profit"),
          `Profit value %`,
          unitPriceLabel,
          `${totalPriceLabel} ${ProfitCurrency}`,
          t("products.profits.pricingListWidget.more"),
        ]);
      }
    } else if (selectedPricingBy?.value === EPricingBy.COST) {
      setTableHeaders([
        `${selectedPricingBy?.label}` +
        (selectedPricingBy?.value === EPricingBy.COST
          ? ` ${ProfitCurrency}`
          : ""),
        t("products.profits.pricingListWidget.profit"),
        `${totalPriceLabel} ${ProfitCurrency}`,
        t("products.profits.pricingListWidget.more"),
      ]);
      if (selectedAdditionalProfitRow?.id) {
        setTableHeaders([
          `${selectedPricingBy?.label}` +
          (selectedPricingBy?.value === EPricingBy.COST
            ? ` ${ProfitCurrency}`
            : ""),
          t("products.profits.pricingListWidget.profit"),
          `Profit value %`,
          `${totalPriceLabel} ${ProfitCurrency}`,
          t("products.profits.pricingListWidget.more"),
        ]);
      }
    } else {
      setTableHeaders([
        `${selectedPricingBy?.label}` +
        (selectedPricingBy?.value === EPricingBy.COST
          ? ` ${ProfitCurrency}`
          : ""),
        unitPriceLabel,
        `${totalPriceLabel} ${ProfitCurrency}`,
        t("products.profits.pricingListWidget.more"),
      ]);
      if (selectedAdditionalProfitRow?.id) {
        setTableHeaders([
          `${selectedPricingBy?.label}` +
          (selectedPricingBy?.value === EPricingBy.COST
            ? ` ${ProfitCurrency}`
            : ""),
          unitPriceLabel,
          `Profit value %`,
          `${totalPriceLabel} ${ProfitCurrency}`,
          t("products.profits.pricingListWidget.more"),
        ]);
      }
    }
  }, [selectedPricingBy, selectedAdditionalProfitRow, router]);

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
      const requestBody: any = {
        recordID: actionProfitByActionId?.recordID,
        id: actionProfitByActionId?.id,
        printingActionId: actionProfitByActionId?.printingActionId,
        pricingBy: data?.value,
        transitionType: selectedTransition?.value,
        minPrice: actionProfitByActionId?.minPrice,
        actionProfitRows: [],
        actionExpections: [],
        productId: router.query.productId,
        isOutSource: router.query.isOutSource ? true : false,
      };
      if (router.query.productId) {
        requestBody.productId = router.query.productId;
      }
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/profits/update-action-profit`,
        requestBody
      );
      if (res?.success) {
        alertSuccessUpdate();
        setSelectedPricingBy(data);
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
      } else {
        alertFaultUpdate();
      }
    },
    [actionProfitByActionId, router, selectedPricingTableItems]
  );

  const updateTransitionForAction = useCallback(
    async (data: SelectedPricingByType) => {
      const requestBody: any = {
        recordID: actionProfitByActionId?.recordID,
        id: actionProfitByActionId?.id,
        printingActionId: actionProfitByActionId?.printingActionId,
        pricingBy: selectedPricingBy?.value,
        transitionType: data?.value,
        minPrice: actionProfitByActionId?.minPrice,
        actionProfitRows: [],
        actionExpections: [],
        isOutSource: router.query.isOutSource ? true : false,
      };
      if (router.query.productId) {
        requestBody.productId = router.query.productId;
      }
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/profits/update-action-profit`,
        requestBody
      );
      if (res?.success) {
        alertSuccessUpdate();
        setSelectedTransition(data);
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
      } else {
        alertFaultUpdate();
      }
    },
    [
      actionProfitByActionId,
      router,
      selectedPricingTableItems,
      selectedPricingBy,
    ]
  );
  useEffect(() => {
    if (router.query.signalRConnectionId) {
      setActionProfitRowsList(calculateCaseValue?.caseProfitRows);
    } else {
      setActionProfitRowsList(allActionProfitRowsByActionId);
    }
  }, [
    allActionProfitRowsByActionId,
    selectedPricingTableItems,
    router,
    calculateCaseValue,
  ]);
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
      const requestBody: any = {
        actionProfitId: actionProfitByActionId?.id,
        value,
        pricingBy: selectedPricingBy?.value,
        totalPrice: totalPrice,
      };

      if (selectedPricingTableItems?.exceptionType !== ETypeException.DEFAULT) {
        requestBody.actionExceptionId = selectedPricingTableItems?.id;
      }

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/printhouse-config/action-profit-rows/add-action-profit-row`,
        requestBody
      );

      if (res?.success) {
        alertSuccessAdded();
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
      } else {
        alertFaultAdded();
      }
    },
    [
      actionProfitByActionId,
      selectedPricingBy,
      selectedPricingTableItems,
      router,
    ]
  );

  const updateActionProfitRow = useCallback(
    async (data: any) => {
      const requestBody: any = {
        id: data?.id,
        actionProfitId: data?.actionProfitId,
        value: data?.value,
        pricingBy: data?.pricingBy,
        totalPrice: data?.totalPrice,
      };

      if (selectedPricingTableItems?.exceptionType !== ETypeException.DEFAULT) {
        requestBody.actionExceptionId = selectedPricingTableItems?.id;
      }
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/action-profit-rows/update-action-profit-row`,
        requestBody
      );
      if (res?.success) {
        alertSuccessUpdate();
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
      } else {
        alertFaultUpdate();
      }
    },
    [selectedPricingTableItems, router]
  );

  const updateMinPriceForAction = useCallback(
    async (data: number) => {
      const requestBody: any = {
        recordID: actionProfitByActionId?.recordID,
        id: actionProfitByActionId?.id,
        printingActionId: actionProfitByActionId?.printingActionId,
        pricingBy: selectedPricingBy?.value,
        transitionType: selectedTransition?.value,
        minPrice: data,
        actionProfitRows: [],
        actionExpections: [],
        isOutSource: router.query.isOutSource ? true : false,
      };
      if (router.query.productId) {
        requestBody.productId = router.query.productId;
      }
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/printhouse-config/profits/update-action-profit`,
        requestBody
      );
      if (res?.success) {
        alertSuccessUpdate();
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
        getActionProfitByActionId();
      } else {
        alertFaultUpdate();
      }
    },
    [
      actionProfitByActionId,
      router,
      selectedPricingTableItems,
      selectedPricingBy,
      selectedTransition,
    ]
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

  const [anchorElAdditionalProfitMenu, setAnchorElAdditionalProfitMenu] =
    useState<null | HTMLElement>(null);
  const openAdditionalProfitMenu = Boolean(anchorElAdditionalProfitMenu);

  const handleClickAdditionalProfitMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElAdditionalProfitMenu(event.currentTarget);
  };
  const handleCloseAdditionalProfitMenu = () => {
    setAnchorElAdditionalProfitMenu(null);
  };

  useEffect(() => {
    if (profitsPricingTables?.length > 0) {
      const defaultRow: any = profitsPricingTables?.find((item) => {
        return item.exceptionType === ETypeException.DEFAULT;
      });
      setSelectedPricingTableItems(defaultRow);
    }
  }, [profitsPricingTables]);
  useEffect(() => {
    if (selectedPricingTableItems?.exceptionType === ETypeException.DEFAULT) {
      setProfitRowType(EProfitRowType.NORMAL_PROFIT_ROW);
    } else {
      setProfitRowType(EProfitRowType.EXCEPRION_PROFIT_ROW);
    }
  }, [selectedPricingTableItems]);
  const [dataForPricing, setDataForPricing] =
    useState<ProfitsPricingTables[]>();
  const [dataForDefault, setDataForDefault] =
    useState<ProfitsPricingTables[]>();
  const [dataForExceptions, setDataForExceptions] =
    useState<ProfitsPricingTables[]>();

  const reOrderPricingTables = useCallback(async (data: any) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/profits/update-re-order-pricing-tables?actionIdOrProductId=${router.query.actionId
      }?isOutSourc=${router.query.isOutSource ? true : false}`,
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
      // Filter items for setDataForPricing (item.exceptionType !== ETypeException.DEFAULT)
      const filteredPricing = filteredArray[1].filter(
        (item) => item.exceptionType !== ETypeException.DEFAULT
      );
      // Filter items for setDataForDefaultPricing (item.exceptionType === ETypeException.DEFAULT)
      const filteredDefaultPricing = filteredArray[1].filter(
        (item) => item.exceptionType === ETypeException.DEFAULT
      );
      setDataForPricing(filteredPricing);
      setDataForDefault(filteredDefaultPricing);
      setDataForExceptions(filteredArray[0]);
    }
  }, [profitsPricingTables]);
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newData = Array.from(dataForPricing);
    const [removed] = newData.splice(result.source.index, 1);
    newData.splice(result.destination.index, 0, removed);
    const transformedArray = newData.map((item, index) => ({
      id: item?.id,
      index: index + 1,
    }));
    setDataForPricing(newData);
    reOrderPricingTables(transformedArray);
  };

  const [anchorElMorePriceTable, setAnchorElMorePriceTable] =
    useState<null | HTMLElement>(null);
  const openMorePriceTable = Boolean(anchorElMorePriceTable);
  const handleClickMorePriceTable = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMorePriceTable(event.currentTarget);
  };
  const handleCloseMorePriceTable = () => {
    setAnchorElMorePriceTable(null);
  };
  const [selectedActionProfitRow, setSelectedActionProfit] = useState();

  const deleteActionProfitRow = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/action-profit-rows/delete-action-profit-row?profitRowType=${profitRowType}&id=${id}`
      );
      if (res?.success) {
        alertSuccessDelete();
        if (router.query.signalRConnectionId) {
          getCalculateCaseProfits();
        } else {
          getAllActionProfitRowsByActionId();
        }
      } else {
        alertFaultDelete();
      }
    },
    [profitRowType, router, selectedPricingTableItems]
  );

  const deleteExceptionProfit = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-exception-profit?actionExceptionId=${id}`
      );
      if (res?.success) {
        alertSuccessDelete();
        getProfitsPricingTables();
        setSelectedActionProfitRow(null);
      } else {
        alertFaultDelete();
      }
    },
    [selectedPricingTableItems]
  );

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
    dataForDefault,
    dataForPricing,
    anchorElMorePriceTable,
    openMorePriceTable,
    selectedActionProfitRow,
    typeExceptionSelected,
    selectedAdditionalProfitRow,
    anchorElAdditionalProfitMenu,
    openAdditionalProfitMenu,
    calculateCaseValue,
    isLoading,
    ProfitCurrency,
    handleCloseAdditionalProfitMenu,
    handleClickAdditionalProfitMenu,
    setSelectedActionProfitRow,
    setTypeExceptionSelected,
    deleteActionProfitRow,
    setSelectedActionProfit,
    handleClickMorePriceTable,
    handleCloseMorePriceTable,
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
    updateTransitionForAction,
    setSelectedTransition,
    changeactionProfitRowsItems,
    addNewStepForActionProfitRow,
    updateActionProfitRow,
    updateMinPriceForAction,
    deleteExceptionProfit,
    getProfitsPricingTables,
  };
};

export { useNewProfits };
