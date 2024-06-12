import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import cloneDeep from "lodash.clonedeep";

import { updateProductItemValueOutsource } from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { actionListForWorkFlow, currentCalculationConnectionId, productItemValueByEditState, viewPricingTab } from "@/store";
import { useGomakeAxios } from "@/hooks";

import { currentProductItemValueDraftId, currentProductItemValueState, selectedWorkFlowState } from "./state";
import { EPricingViews } from "./enums";
import { getWorkFlowsActionsApi, getWorkFlowsApi } from "@/services/api-service/generic-doc/quote-confirmation-api";

const usePricingWidget = ({ getOutSourcingSuppliers, workFlows }) => {

    const [view, setView] = useRecoilState<EPricingViews>(viewPricingTab);
    const [actionList,setActionList] = useRecoilState(actionListForWorkFlow)
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
    const productItemValueByEdit = useRecoilValue<any>(productItemValueByEditState)
  
    const [isChangeView, setIsChangeView] = useState(true)
  
    useEffect(() => {
      // Transform actions when component mounts
      selectedWorkFlow?.actions.map(action => {
        if (!action.isCalculated) {
          const originalAction = selectedWorkFlow?.actions.find(a => a.id === action.id);
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
    const [currentProductItemValue, setCurrentProductItemValue] = useRecoilState<any>(currentProductItemValueState);
    const productItemValueDraftId = useRecoilValue<string>(currentProductItemValueDraftId);

    const [tabs, setTabs] = useState([]);
    const connectionId = useRecoilValue(currentCalculationConnectionId);
    const updateProductItemValue = async (sourceType: number) => {
      await updateProductItemValueOutsource(callApi, () => { }, {
        productItemValueId: productItemValueDraftId,
        signalRConnectionId: connectionId,
        sourceType
      })
    }
  
    useEffect(() => {
      getOutSourcingSuppliers();
    }, []);
    useEffect(() => {
      if (productItemValueByEdit?.sourceType && isChangeView) {
        setView(EPricingViews.OUTSOURCE_WORKFLOW)
      }
      else if (!selectedWorkFlow) {
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
      if (productItemValueByEdit?.sourceType && isChangeView) {
        setView(EPricingViews.OUTSOURCE_WORKFLOW)
      }
      else if (selectedWorkFlow && currentProductItemValue && isChangeView) {
        setView(EPricingViews.SELECTED_WORKFLOW);
      }
    }, [selectedWorkFlow, currentProductItemValue, isChangeView])
  
  
    const reorderedTabs = [
      ...(tabs.find(tab => tab.key === "general") ? [tabs.find(tab => tab.key === "general")] : []), // "Flows Pending" tab if exists
      ...tabs.filter(tab => tab.key !== "general") // Other tabs
    ];
    const [selectedTab, setSelectedTab] = useState("")
    const [filterWorkFlow, setFilterWorkFlow] = useState<any>()
  
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
        if (currentItem.isCompleteWorkFlow === false && currentItem.productType !== null) {
          const existingTab = accumulator.find(tab => tab.tabName === currentItem.sectionName && tab.key === currentItem.productType);
          if (!existingTab) {
            accumulator.push({ tabName: currentItem.sectionName, key: currentItem.productType });
          }
        } else if (currentItem.isCompleteWorkFlow === false && currentItem.productType === null) {
          const existingTab = accumulator.find(tab => tab.tabName === t("pricingWidget.flowsPending") && tab.key === "general");
          if (!existingTab) {
            accumulator.push({ tabName: t("pricingWidget.flowsPending"), key: "general" });
          }
        }
        else if (currentItem.isCompleteWorkFlow === true && currentItem.productType === null && currentItem.subWorkFlows.length === 0) {
          const existingTab = accumulator.find(tab => tab.tabName === t("pricingWidget.flows") && tab.key === "other");
          if (!existingTab) {
            accumulator.push({ tabName: t("pricingWidget.flows"), key: "other" });
          }
        }
        return accumulator;
      }, []);
  
      setTabs(newTabs);
    }, [workFlows]);
    const [selectedWorkFlowsByTabList,settledWorkFlowsByTabList] =useState([])
    const getWorkFlowsByTab = async (productType) => {
      const callBack = (res) => {
          if (res?.success) {
             settledWorkFlowsByTabList(res?.data)
          } else {
              // alertFaultUpdate();
          }
      }
      await getWorkFlowsApi(callApi, callBack, { signalRConnectionId:connectionId,pageSize: 10,productType:productType})
  }

  const getWorkFlowsActions = async (workFlowId) => {
    setActionList([])
    const callBack = (res) => {
        if (res?.success) {
           setActionList(res?.data)
          
        } else {
            // alertFaultUpdate();
        }
    }
    await getWorkFlowsActionsApi(callApi, callBack, { signalRConnectionId:connectionId,workFlowId})
}
  
  
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
        t
    }
}

export {usePricingWidget}