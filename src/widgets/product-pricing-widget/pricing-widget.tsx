import { Stack, ButtonGroup, Divider } from "@mui/material";

import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { OutSourceSuppliers } from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
import { InOutSourceSelect } from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import { SubWorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/sub-work-flow-component";
import { WorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/work-flow-component";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import { EPricingViews, EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { IPricingWidgetProps } from "@/widgets/product-pricing-widget/interface";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { usePricingWidget } from "./use-pricing-widget";

const PricingWidget = ({ workFlows, getOutSourcingSuppliers, widgetType }: IPricingWidgetProps) => {
  const { classes } = useStyle();
  const {
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
    t

  } = usePricingWidget({ workFlows, getOutSourcingSuppliers })
  const sections = [
    {
      sectionName: "Pending Flows",
      productType: null,
      sumOfWorkFlow: 22
    },
    {
      sectionName: "Cover",
      productType: "Cover",
      sumOfWorkFlow: 8
    },
    {
      sectionName: "Internal Pages",
      productType: "InternalPages",
      sumOfWorkFlow: 18
    }
  ]


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
            {
              sections?.map((section, index) => {
                return (
                  <PrimaryButton
                    data-tour={'allWorkflowsBtn'}
                    onClick={() => {
                      setView(EPricingViews.OTHERS_WORKFLOWS)
                      setSelectedTab(section.productType)
                      setFilterWorkFlow(section.productType)
                    }}
                    sx={classes.button}
                    variant={
                      view === EPricingViews.OTHERS_WORKFLOWS && selectedTab === section.productType
                        ? "contained"
                        : "outlined"
                    }
                  >{section?.sectionName}{" "}({section.sumOfWorkFlow})

                  </PrimaryButton>
                )
              })
            }
            {/* {reorderedTabs.map((tab, index) => {
              return (
                <PrimaryButton
                  data-tour={'allWorkflowsBtn'}
                  onClick={() => {
                    setView(EPricingViews.OTHERS_WORKFLOWS)
                    setSelectedTab(tab.key)
                    setFilterWorkFlow(tab.key)
                  }}
                  sx={classes.button}
                  variant={
                    view === EPricingViews.OTHERS_WORKFLOWS && selectedTab === tab.key
                      ? "contained"
                      : "outlined"
                  }
                >{tab?.tabName}{" "}
                  ({
                    workFlows.filter(flow => {
                      if (flow.productType !== null) {
                        return flow.productType === tab?.key;
                      } else {
                        if (flow.isCompleteWorkFlow === true && flow.subWorkFlows.length === 0) {
                          return tab?.key === "other";
                        } else if (flow.isCompleteWorkFlow === false) {
                          return tab?.key === "general";
                        }

                      }
                    }).length
                  })
                </PrimaryButton>
              )
            })} */}

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
            workflows={sortedArray.filter(flow => {
              if (flow.productType !== null) {
                return flow.productType === filterWorkFlow;
              } else {
                if (flow.isCompleteWorkFlow === true) {
                  return filterWorkFlow === "other";
                } else {
                  return filterWorkFlow === "general";
                }

              }
            })}
          />
        </div>
      )}
      {view === EPricingViews.OUTSOURCE_WORKFLOW && <OutSourceSuppliers widgetType={widgetType} />}
    </Stack>
  );
};
export { PricingWidget };
