import { IPricingWidgetProps } from "@/widgets/product-pricing-widget/interface";
import {
  GeneralInformationComponent
} from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { ButtonGroup, Divider } from "@mui/material";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { WorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/work-flow-component";
import { InOutSourceSelect } from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import {
  EPricingViews,
  EWorkSource,
} from "@/widgets/product-pricing-widget/enums";
import {
  OutSourceSuppliers
} from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  calculationProgressState,
  currentProductItemValueDraftId,
  currentProductItemValuePriceState,
  currentProductItemValueState, currentProductItemValueTotalWorkFlowsState,
  selectedWorkFlowState,
} from "@/widgets/product-pricing-widget/state";
import cloneDeep from "lodash.clonedeep";
import { SubWorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/sub-work-flow-component";
import {
  updateProductItemValueOutsource
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { useGomakeAxios } from "@/hooks";
import { currentCalculationConnectionId } from "@/store";
import { Stack } from "@mui/material";

const PricingWidget = ({
  workFlows,
  getOutSourcingSuppliers,
}: IPricingWidgetProps) => {
  const [view, setView] = useState<EPricingViews>(
    EPricingViews.SELECTED_WORKFLOW
  );
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { classes } = useStyle();
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
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
  const [currentProductItemValue, setCurrentProductItemValue] =
    useRecoilState<any>(currentProductItemValueState);
  const currentProductItemValueTotalWorkFlows = useRecoilValue<number>(currentProductItemValueTotalWorkFlowsState);
  const productItemValueDraftId = useRecoilValue<string>(
    currentProductItemValueDraftId
  );
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
    if (selectedWorkFlow && currentProductItemValue && isChangeView) {
      setView(EPricingViews.SELECTED_WORKFLOW);

    }
  }, [selectedWorkFlow, currentProductItemValue, isChangeView])
  const [
    currentProductItemValueTotalPrice,
    setCurrentProductItemValueTotalPrice,
  ] = useRecoilState<number>(currentProductItemValuePriceState);

  useEffect(() => {
    if (view === EPricingViews.OUTSOURCE_WORKFLOW || selectedWorkFlow?.actions?.some(
      (action) => action.source === EWorkSource.OUT
    )) {
      // setCurrentProductItemValueTotalPrice(null)
      setTimeout(() => {
        setCurrentProductItemValueTotalPrice(null)

      }, 2000);
    }
  }, [view, selectedWorkFlow])

  return (
    <Stack gap={"16px"} width={"100%"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        {!!workFlows && view !== EPricingViews.OUTSOURCE_WORKFLOW ? (
          <ButtonGroup sx={classes.buttonGroup} orientation={"horizontal"}>
            <PrimaryButton
              onClick={() => setView(EPricingViews.SELECTED_WORKFLOW)}
              sx={classes.button}
              variant={
                view === EPricingViews.SELECTED_WORKFLOW
                  ? "contained"
                  : "outlined"
              }
            >
              {t("pricingWidget.selected")}
            </PrimaryButton>
            <PrimaryButton
              data-tour={'allWorkflowsBtn'}
              onClick={() => setView(EPricingViews.OTHERS_WORKFLOWS)}
              sx={classes.button}
              variant={
                view === EPricingViews.OTHERS_WORKFLOWS
                  ? "contained"
                  : "outlined"
              }
            >{`${t("pricingWidget.others")} (${currentProductItemValueTotalWorkFlows
              })`}</PrimaryButton>
          </ButtonGroup>
        ) : (
          <div />
        )}
        <InOutSourceSelect
          onChange={(v: EWorkSource) => {
            setView(
              v === EWorkSource.OUT
                ? EPricingViews.OUTSOURCE_WORKFLOW
                : EPricingViews.SELECTED_WORKFLOW
            )
            updateProductItemValue(v)
            setIsChangeView(false)


          }

          }
          disabled={!selectedWorkFlow}
          withPartially={selectedWorkFlow?.actions?.some(
            (action) => action.source === EWorkSource.OUT
          )}
          value={
            view === EPricingViews.OUTSOURCE_WORKFLOW
              ? EWorkSource.OUT
              : EWorkSource.INTERNAL
          }
        />
      </Stack>
      {selectedWorkFlow && (
        <GeneralInformationComponent
          details={selectedWorkFlow?.generalInformation}
        />
      )}
      <Divider />
      {selectedWorkFlow && view === EPricingViews.SELECTED_WORKFLOW && (
        <div data-tour={'actions-container'}>
          <SubWorkFlowsComponent
            isEditableActions={true}
            workflows={selectedWorkFlow?.subWorkFlows || []}
          />
          <Actions
            actions={selectedWorkFlow?.actions}
            productType={selectedWorkFlow.productType}
          />
        </div>
      )}
      {workFlows && view === EPricingViews.OTHERS_WORKFLOWS && (
        <div data-tour={'allWorkflowsContainer'}>
          <WorkFlowsComponent

            showSelected={() => setView(EPricingViews.SELECTED_WORKFLOW)}
            workflows={workFlows}
          />
        </div>
      )}
      {view === EPricingViews.OUTSOURCE_WORKFLOW && <OutSourceSuppliers />}
    </Stack>
  );
};
export { PricingWidget };
