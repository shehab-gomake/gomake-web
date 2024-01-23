import { IPricingWidgetProps } from "@/widgets/product-pricing-widget/interface";
import Stack from "@mui/material/Stack";
import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
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
import { OutSourceSuppliers } from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentProductItemValueDraftId,
  currentProductItemValueState,
  selectedWorkFlowState,
} from "@/widgets/product-pricing-widget/state";
import cloneDeep from "lodash.clonedeep";
import { SubWorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/sub-work-flow-component";

const PricingWidget = ({
  workFlows,
  getOutSourcingSuppliers,
}: IPricingWidgetProps) => {
  const [view, setView] = useState<EPricingViews>(
    EPricingViews.SELECTED_WORKFLOW
  );
  const { t } = useTranslation();
  const { classes } = useStyle();
  const selectedWorkFlow = useRecoilValue(selectedWorkFlowState);
  console.log("selectedWorkFlow", selectedWorkFlow);
  const [currentProductItemValue, setCurrentProductItemValue] =
    useRecoilState<any>(currentProductItemValueState);
  const productItemValueDraftId = useRecoilValue<string>(
    currentProductItemValueDraftId
  );

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
              onClick={() => setView(EPricingViews.OTHERS_WORKFLOWS)}
              sx={classes.button}
              variant={
                view === EPricingViews.OTHERS_WORKFLOWS
                  ? "contained"
                  : "outlined"
              }
            >{`${t("pricingWidget.others")} (${
              workFlows?.length
            })`}</PrimaryButton>
          </ButtonGroup>
        ) : (
          <div />
        )}
        <InOutSourceSelect
          onChange={(v: EWorkSource) =>
            setView(
              v === EWorkSource.OUT
                ? EPricingViews.OUTSOURCE_WORKFLOW
                : EPricingViews.SELECTED_WORKFLOW
            )
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
        <>
          <SubWorkFlowsComponent
            isEditableActions={true}
            workflows={selectedWorkFlow?.subWorkFlows || []}
          />
          <Actions
            actions={selectedWorkFlow?.actions}
            productType={selectedWorkFlow.productType}
          />
        </>
      )}
      {workFlows && view === EPricingViews.OTHERS_WORKFLOWS && (
        <WorkFlowsComponent
          showSelected={() => setView(EPricingViews.SELECTED_WORKFLOW)}
          workflows={workFlows}
        />
      )}
      {view === EPricingViews.OUTSOURCE_WORKFLOW && <OutSourceSuppliers />}
    </Stack>
  );
};
export { PricingWidget };
