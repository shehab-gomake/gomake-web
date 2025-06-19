import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import cloneDeep from "lodash.clonedeep";

import {
  addActionToWorkFlowApi,
  addOutSourceActionApi,
  removeOutSourceActionApi,
  updateActionsOrderInWorkFlowApi,
  updateProductItemValueOutsource,
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import {
  actionListForWorkFlow,
  currentCalculationConnectionId,
  foldOptionsState,
  productItemValueByEditState,
  userState,
  viewPricingTab,
} from "@/store";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";

import {
  calculationResultState,
  currentProductItemValueDraftId,
  currentProductItemValuePriceState,
  currentProductItemValueState,
  selectedWorkFlowState,
  sliderCurrentProductItemValuePriceState,
} from "./state";
import { EPricingViews, EWorkSource } from "./enums";
import {
  getWorkFlowsActionsApi,
  getWorkFlowsApi,
  selectWorkflowByIdApi,
} from "@/services/api-service/generic-doc/quote-confirmation-api";
import { UNIT_TYPE } from "@/enums";
import { getAllActionsApi } from "@/services/api-service/production-floor/production-floor-endpoints";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useRouter } from "next/router";

const usePricingWidget = ({
  getOutSourcingSuppliers,
  workFlows,
  widgetType,
  selectedWorkFlowCalculatedIsLoaded,
  getSelectedWorkFlow,
}) => {
  const [view, setView] = useRecoilState<EPricingViews>(viewPricingTab);
  const [actionList, setActionList] = useRecoilState(actionListForWorkFlow);
  const [actionListDropDown, setActionListDropDown] = useState([]);
  const [actionNameSelected, setActionNameSelected] = useState<any>();
  const [sectionNameSelected, setSectionNames] = useState<any>();
  const [isAddNewAction, setIsAddNewAction] = useState(false);

  const onClickCloseAddNewAction = () => {
    setIsAddNewAction(false);
  };
  const onClickAddNewAction = () => {
    setIsAddNewAction(true);
  };

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  const productItemValueByEdit = useRecoilValue<any>(
    productItemValueByEditState
  );
  const [pageSize, setPageSize] = useState(10);
  const [heightScrolling, setHeightScrolling] = useState(50);
  const [isChangeView, setIsChangeView] = useState(true);
  const [isFirstEntry, setIsFirstEntry] = useState(false);
  const { alertFaultUpdate, alertFaultAdded, alertSuccessAdded } =
    useSnackBar();

  const [anchorElActionsListMenu, setAnchorElActionsListMenu] =
    useState<null | HTMLElement>(null);
  const [anchorElSectionNameListMenu, setAnchorElSectionNameListMenu] =
    useState<null | HTMLElement>(null);
  const openActionsListMenu = Boolean(anchorElActionsListMenu);
  const openSectionNameListMenu = Boolean(anchorElSectionNameListMenu);
  const handleCloseActionsListMenu = () => {
    setAnchorElActionsListMenu(null);
  };
  const handleCloseSectionNameListMenu = () => {
    setAnchorElSectionNameListMenu(null);
  };

  const handleOpenActionsListMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElActionsListMenu(event.currentTarget);
  };
  const handleOpenSectionNameListMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElSectionNameListMenu(event.currentTarget);
  };

  useEffect(() => {
    // Transform actions when component mounts
    selectedWorkFlow?.actions.map((action) => {
      if (!action.isCalculated) {
        const originalAction = selectedWorkFlow?.actions.find(
          (a) => a.id === action.id
        );
        return {
          ...action,
          profit: { ...originalAction.profit },
          totalCost: { ...originalAction.totalCost },
          totalPrice: { ...originalAction.totalPrice },
          totalProductionTime: { ...originalAction.totalProductionTime },
        };
      }
      return action;
    });
  }, [selectedWorkFlow?.actions]);
  const [currentProductItemValue, setCurrentProductItemValue] =
    useRecoilState<any>(currentProductItemValueState);
  const productItemValueDraftId = useRecoilValue<string>(
    currentProductItemValueDraftId
  );

  const [tabs, setTabs] = useState([]);
  const connectionId = useRecoilValue(currentCalculationConnectionId);

  const setCurrentProductItemValueTotalPrice = useSetRecoilState<number>(
    currentProductItemValuePriceState
  );
  const calculationResult = useRecoilValue(calculationResultState);
  const [isUpdateResolved, setIsUpdateResolved] = useState(false);
  const setSliderCurrentProductItemValueTotalPrice = useSetRecoilState<number>(
    sliderCurrentProductItemValuePriceState
  );

  useEffect(() => {
    if (isUpdateResolved) {
      setCurrentProductItemValueTotalPrice(calculationResult?.totalPrice);
      setSliderCurrentProductItemValueTotalPrice(calculationResult?.totalPrice); //!new
      setIsUpdateResolved(false);
    }
  }, [calculationResult, selectedWorkFlowCalculatedIsLoaded]);

  const updateProductItemValue = async (sourceType: number) => {
    const callBack = (res) => {
      if (res?.success) {
        setIsUpdateResolved(true);
      } else {
        alertFaultUpdate();
      }
    };

    await updateProductItemValueOutsource(callApi, callBack, {
      productItemValueId: productItemValueDraftId,
      signalRConnectionId: connectionId,
      sourceType,
    });
  };

  const withPartially = selectedWorkFlow?.actions?.some(
    (action) => action.source === EWorkSource.OUT
  );
  useEffect(() => {
    getOutSourcingSuppliers();
  }, []);

  useEffect(() => {
    if (productItemValueByEdit?.sourceType === EWorkSource.OUT) {
      setView(EPricingViews.OUTSOURCE_WORKFLOW);
    } else if (productItemValueByEdit?.sourceType === EWorkSource.INTERNAL) {
      setView(EPricingViews.SELECTED_WORKFLOW);
    }
  }, [productItemValueByEdit]);

  useEffect(() => {
    if (!selectedWorkFlow) {
      setView(EPricingViews.OUTSOURCE_WORKFLOW);
    } else if (currentProductItemValue) {
      let temp = cloneDeep(currentProductItemValue);
      temp.workFlow = [selectedWorkFlow];
      const productItemValue = cloneDeep(currentProductItemValue);
      productItemValue.id = productItemValueDraftId;
      setCurrentProductItemValue(productItemValue);
    }
  }, [selectedWorkFlow]);
  useEffect(() => {
    if (selectedWorkFlow?.isOutSourceWorkFlow) {
      setView(EPricingViews.OUTSOURCE_WORKFLOW);
    } else {
      setView(EPricingViews.SELECTED_WORKFLOW);
    }
  }, [selectedWorkFlow]);

  const reorderedTabs = [
    ...(tabs.find((tab) => tab.key === "general")
      ? [tabs.find((tab) => tab.key === "general")]
      : []), // "Flows Pending" tab if exists
    ...tabs.filter((tab) => tab.key !== "general"), // Other tabs
  ];
  const [selectedTab, setSelectedTab] = useState<any>();
  const allCountSelectedTabWorkFlow = selectedTab?.count + 1;

  const [filterWorkFlow, setFilterWorkFlow] = useState<any>();

  const sortedArray = workFlows.slice().sort((a, b) => {
    if (a.selected === b.selected) {
      return 0;
    } else if (a.selected) {
      return -1;
    } else {
      return 1;
    }
  });

  useEffect(() => {
    const newTabs = workFlows.reduce((accumulator, currentItem) => {
      if (
        currentItem.isCompleteWorkFlow === false &&
        currentItem.productType !== null
      ) {
        const existingTab = accumulator.find(
          (tab) =>
            tab.tabName === currentItem.sectionName &&
            tab.key === currentItem.productType
        );
        if (!existingTab) {
          accumulator.push({
            tabName: currentItem.sectionName,
            key: currentItem.productType,
          });
        }
      } else if (
        currentItem.isCompleteWorkFlow === false &&
        currentItem.productType === null
      ) {
        const existingTab = accumulator.find(
          (tab) =>
            tab.tabName === t("pricingWidget.flowsPending") &&
            tab.key === "general"
        );
        if (!existingTab) {
          accumulator.push({
            tabName: t("pricingWidget.flowsPending"),
            key: "general",
          });
        }
      } else if (
        currentItem.isCompleteWorkFlow === true &&
        currentItem.productType === null &&
        currentItem.subWorkFlows.length === 0
      ) {
        const existingTab = accumulator.find(
          (tab) =>
            tab.tabName === t("pricingWidget.flows") && tab.key === "other"
        );
        if (!existingTab) {
          accumulator.push({ tabName: t("pricingWidget.flows"), key: "other" });
        }
      }
      return accumulator;
    }, []);

    setTabs(newTabs);
  }, [workFlows]);
  const [selectedWorkFlowsByTabList, settledWorkFlowsByTabList] = useState([]);

  const fetchWorkflows = async (productType, newPageSize) => {
    setIsFirstEntry(false);
    const callBack = (res) => {
      if (res?.success) {
        settledWorkFlowsByTabList(res?.data);
      } else {
        console.error("Failed to fetch workflows");
      }
    };
    await getWorkFlowsApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      pageSize: newPageSize,
      productType: productType,
    });
  };
  const router = useRouter();


  const handleTabClick = (productType) => {
    console.log("productType", productType);
    // setView(EPricingViews.OTHERS_WORKFLOWS);
    // setSelectedTab(productType?.name);
    // setPageSize(10);
    // setHeightScrolling(50);
    // settledWorkFlowsByTabList([]);
    // fetchWorkflows(productType, 10);
  };

  useEffect(() => {
    if (isFirstEntry) {
      fetchWorkflows(selectedTab?.productType, pageSize);
    }
  }, [pageSize, selectedTab]);

  const handleScroll = () => {
    setIsFirstEntry(true);
    setPageSize((prevPageSize) => prevPageSize + 10);
  };

  const getWorkFlowsByTab = async (productType) => {
    const callBack = (res) => {
      if (res?.success) {
        settledWorkFlowsByTabList(res.data);
      } else {
        // alertFaultUpdate();
      }
    };
    await getWorkFlowsApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      pageSize: pageSize,
      productType: productType,
    });
  };

  const getWorkFlowsActions = async (workFlowId) => {
    setActionList([]);
    const callBack = (res) => {
      if (res?.success) {
        setActionList(res?.data);
      } else {
        // alertFaultUpdate();
      }
    };
    await getWorkFlowsActionsApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      workFlowId,
    });
  };

  const onClickAddOutSourceAction = async () => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await addOutSourceActionApi(callApi, callBack, {
      productItemValueId: productItemValueDraftId,
      signalRConnectionId: connectionId,
      sourceType: EWorkSource.OUT,
    });
  };

  const onClickRemoveOutSourceAction = async (actionId) => {
    const callBack = (res) => {
      if (res.success) {
        getSelectedWorkFlow();
      }
    };
    await removeOutSourceActionApi(callApi, callBack, {
      actionId,
      signalRConnectionId: connectionId,
    });
  };

  const getActions = async () => {
    const callBack = (res) => {
      if (res.success) {
        setActionListDropDown(res?.data);
      }
    };
    await getAllActionsApi(callApi, callBack);
  };
  useEffect(() => {
    getActions();
  }, []);

  const hasSubWorkFlowsOrProductTypeActions = (selectedWorkFlow) => {
    if (selectedWorkFlow?.subWorkFlows?.length > 0) {
      return true;
    } else if (selectedWorkFlow?.subWorkFlows?.length === 0) {
      return selectedWorkFlow?.actions?.some((action) => action.productType);
    }
    return false;
  };

  const getSectionNames = (selectedWorkFlow) => {
    const sectionNamesMap = new Map();

    if (hasSubWorkFlowsOrProductTypeActions(selectedWorkFlow)) {
      if (selectedWorkFlow?.subWorkFlows?.length > 0) {
        selectedWorkFlow.subWorkFlows.forEach((subWorkFlow) => {
          if (!sectionNamesMap.has(subWorkFlow.productType)) {
            sectionNamesMap.set(
              subWorkFlow.productType,
              subWorkFlow.sectionName
            );
          }
        });
      } else if (selectedWorkFlow?.subWorkFlows?.length === 0) {
        selectedWorkFlow.actions.forEach((action) => {
          if (action.productType && !sectionNamesMap.has(action.productType)) {
            sectionNamesMap.set(action.productType, action.sectionName);
          }
        });
      }
    }

    return Array.from(sectionNamesMap, ([productType, sectionName]) => ({
      productType,
      sectionName,
    }));
  };

  const onClickAddActionToWorkFlow = async () => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
      } else {
        alertFaultAdded();
      }
    };
    await addActionToWorkFlowApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      productType: sectionNameSelected?.sectionName
        ? sectionNameSelected?.productType
        : null,
      actionId: actionNameSelected?.id,
      sectionName: sectionNameSelected?.sectionName
        ? sectionNameSelected?.sectionName
        : null,
    });
  };

  const reOderMainActions = async (data) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await updateActionsOrderInWorkFlowApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      actionOrderIndexList: data,
    });
  };
  const reOderSubWorkFlows = async (data) => {
    const callBack = (res) => {
      if (res.success) {
      }
    };
    await updateActionsOrderInWorkFlowApi(callApi, callBack, {
      signalRConnectionId: connectionId,
      subProductOrderIndex: data,
    });
  };
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;

  const {
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
  } = useCustomerDropDownList({
    clientType: CLIENT_TYPE.SUPPLIER,
  });

  return {
    view,
    setView,
    reorderedTabs,
    setSelectedTab,
    setFilterWorkFlow,
    selectedTab,
    updateProductItemValue,
    setIsChangeView,
    selectedWorkFlow,
    sortedArray,
    filterWorkFlow,
    getWorkFlowsByTab,
    getWorkFlowsActions,
    selectedWorkFlowsByTabList,
    settledWorkFlowsByTabList,
    setPageSize,
    pageSize,
    handleTabClick,
    setHeightScrolling,
    heightScrolling,
    handleScroll,
    allCountSelectedTabWorkFlow,
    t,
    onClickAddOutSourceAction,
    onClickRemoveOutSourceAction,
    actionListDropDown,
    hasSubWorkFlowsOrProductTypeActions,
    getSectionNames,
    sectionNameSelected,
    setSectionNames,
    actionNameSelected,
    setActionNameSelected,
    isAddNewAction,
    onClickCloseAddNewAction,
    onClickAddNewAction,
    onClickAddActionToWorkFlow,
    anchorElActionsListMenu,
    openActionsListMenu,
    handleCloseActionsListMenu,
    handleOpenActionsListMenu,
    anchorElSectionNameListMenu,
    openSectionNameListMenu,
    handleCloseSectionNameListMenu,
    handleOpenSectionNameListMenu,
    reOderMainActions,
    reOderSubWorkFlows,
    unitType,
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
  };
};

export { usePricingWidget };
