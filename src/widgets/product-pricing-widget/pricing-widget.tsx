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
import { useRecoilValue } from "recoil";
import { calculationResultState } from "./state";
import { useState } from "react";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { ActionsListMenu } from "./components/actions-menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SectionNameListMenu } from "./components/sections-menu";

const PricingWidget = ({
  workFlows,
  getOutSourcingSuppliers,
  widgetType,
  setSelectedWorkFlowCalculatedIsLoaded,
  selectedWorkFlowCalculatedIsLoaded,
  getSelectedWorkFlow
}: IPricingWidgetProps) => {
  const { classes } = useStyle();
  const {
    view,
    setView,
    setSelectedTab,
    selectedTab,
    updateProductItemValue,
    setIsChangeView,
    selectedWorkFlow,
    getWorkFlowsActions,
    selectedWorkFlowsByTabList,
    settledWorkFlowsByTabList,
    pageSize,
    handleTabClick,
    handleScroll,
    allCountSelectedTabWorkFlow,
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
    t,
    anchorElActionsListMenu,
    openActionsListMenu,
    handleCloseActionsListMenu,
    handleOpenActionsListMenu,
    anchorElSectionNameListMenu,
    openSectionNameListMenu,
    handleCloseSectionNameListMenu,
    handleOpenSectionNameListMenu,
    reOderMainActions,
    reOderSubWorkFlows

  } = usePricingWidget({ workFlows, getOutSourcingSuppliers, widgetType, selectedWorkFlowCalculatedIsLoaded, getSelectedWorkFlow });
  const isHasSubWorkFlowsOrProductTypeActions = hasSubWorkFlowsOrProductTypeActions(selectedWorkFlow)
  const sectionNames = getSectionNames(selectedWorkFlow);

  const calculationResult = useRecoilValue(calculationResultState);
  const [selectedWorkFlowId, setSelectedWorkFlowId] = useState("");
  return (
    <Stack gap={"16px"} width={"100%"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        {!!workFlows && view !== EPricingViews.OUTSOURCE_WORKFLOW ? (
          <ButtonGroup sx={classes.buttonGroup} orientation={"horizontal"}>
            <PrimaryButton
              onClick={() => {
                setView(EPricingViews.SELECTED_WORKFLOW)
                settledWorkFlowsByTabList([])
              }}
              sx={classes.button}
              variant={
                view === EPricingViews.SELECTED_WORKFLOW
                  ? "contained"
                  : "outlined"
              }

            >
              {t("pricingWidget.selected")}
            </PrimaryButton>
            {calculationResult &&
              calculationResult?.tabs?.map((section, index) => (
                <PrimaryButton
                  key={index}
                  data-tour="allWorkflowsBtn"
                  onClick={() => {
                    handleTabClick(section.productType)
                    setSelectedTab(section)
                  }
                  }
                  sx={classes.button}
                  variant={
                    view === EPricingViews.OTHERS_WORKFLOWS && selectedTab?.productType === section.productType
                      ? 'contained'
                      : 'outlined'
                  }
                >
                  {section.isNeedTranslation ? t("workFlowTabs." + section.name) : section.name} ({section.count + 1})
                </PrimaryButton>
              ))}

          </ButtonGroup>
        ) : (
          <div />
        )}
        <Stack direction={"row"} gap={"10px"}>
          {
            isHasSubWorkFlowsOrProductTypeActions &&
            <div style={classes.autoCompleteSelectedSectionName} onClick={handleOpenSectionNameListMenu}>
              {t("pricingWidget.selectAction")}
              <ArrowDropDownIcon />
            </div>
          }
          {!isHasSubWorkFlowsOrProductTypeActions && <GoMakeAutoComplate
            options={actionListDropDown}
            key={actionNameSelected}
            style={classes.autoCompleteSelectedAction}
            placeholder={t("pricingWidget.selectAction")}
            withArrow={true}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => {
              onClickAddNewAction()
              setActionNameSelected(value)
            }}
            value={actionNameSelected ?? null}
          />}

          <InOutSourceSelect
            onChange={(v: EWorkSource) => {
              setSelectedWorkFlowCalculatedIsLoaded(true)
              setView(
                v === EWorkSource.OUT
                  ? EPricingViews.OUTSOURCE_WORKFLOW
                  : EPricingViews.SELECTED_WORKFLOW
              )
              updateProductItemValue(v)
              setIsChangeView(false)
            }}
            disabled={!selectedWorkFlow}
            withPartially={selectedWorkFlow?.actions?.some(
              (action) => action.source === EWorkSource.OUT
            ) && view !== EPricingViews.OUTSOURCE_WORKFLOW && !selectedWorkFlowCalculatedIsLoaded}
            value={
              view === EPricingViews.OUTSOURCE_WORKFLOW
                ? EWorkSource.OUT
                : EWorkSource.INTERNAL
            }
          />

        </Stack>
      </Stack>
      {selectedWorkFlow && (
        <GeneralInformationComponent
          details={selectedWorkFlow?.generalInformation}
          details2={selectedWorkFlow?.generalInformationProductionFloor}
        />
      )}
      <Divider />

      {selectedWorkFlow && view === EPricingViews.SELECTED_WORKFLOW && (
        <div data-tour={'actions-container'}>
          <SubWorkFlowsComponent
            widgetType={widgetType}
            isEditableActions={true}
            workflows={selectedWorkFlow?.subWorkFlows || []}
            reOderMainActions={reOderMainActions}
            reOderSubWorkFlows={reOderSubWorkFlows}
          />
          <Actions
            actions={selectedWorkFlow?.actions}
            productType={selectedWorkFlow.productType}
            widgetType={widgetType}
            selectedWorkFlowCalculatedIsLoaded={selectedWorkFlowCalculatedIsLoaded}
            reOderMainActions={reOderMainActions}
          />
        </div>
      )}
      {selectedWorkFlowsByTabList?.length > 0 && view === EPricingViews.OTHERS_WORKFLOWS && (
        <div data-tour={'allWorkflowsContainer'}>
          <WorkFlowsComponent
            showSelected={() => setView(EPricingViews.SELECTED_WORKFLOW)}
            workflows={selectedWorkFlowsByTabList}
            getWorkFlowsActions={getWorkFlowsActions}
            selectedWorkFlowId={selectedWorkFlowId}
            setSelectedWorkFlowId={setSelectedWorkFlowId}
            widgetType={widgetType}
          />
          {
            pageSize < allCountSelectedTabWorkFlow &&
            <>
              <div style={{
                display: 'flex',
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                ...FONT_FAMILY.Lexend(500, 14),
                cursor: "pointer",
                color: "#2E3092"
              }} onClick={handleScroll}>{t("sales.quote.showMore")} <ReadMoreIcon style={{ color: "#2E3092" }} /></div>
            </>
          }


        </div>
      )}
      {view === EPricingViews.OUTSOURCE_WORKFLOW && (
        <OutSourceSuppliers
          widgetType={widgetType}
          onClickAddOutSourceAction={onClickAddOutSourceAction}
          selectedWorkFlow={selectedWorkFlow}
          selectedWorkFlowCalculatedIsLoaded={selectedWorkFlowCalculatedIsLoaded}
          onClickRemoveOutSourceAction={onClickRemoveOutSourceAction}
        />
      )}

      <GoMakeDeleteModal
        title={t("are you sure you want to add this action?")}
        yesBtn={t("sales.quote.add")}
        openModal={isAddNewAction}
        onClose={onClickCloseAddNewAction}
        hideIcon
        onClickDelete={onClickAddActionToWorkFlow}
        onClickCancel={() => setActionNameSelected(null)}

      />
      <ActionsListMenu
        handleClose={handleCloseActionsListMenu}
        open={openActionsListMenu}
        anchorEl={anchorElActionsListMenu}
        actionListDropDown={actionListDropDown}
        setActionNameSelected={setActionNameSelected}
        onClickAddNewAction={onClickAddNewAction}
        handleCloseSectionNameListMenu={handleCloseSectionNameListMenu}
      />
      <SectionNameListMenu
        handleClose={handleCloseSectionNameListMenu}
        open={openSectionNameListMenu}
        anchorEl={anchorElSectionNameListMenu}
        handleOpen={handleOpenActionsListMenu}
        sectionNames={[...sectionNames, {
          sectionName: t("pricingWidget.general"),
          productType: null
        }]}
        setSectionNames={setSectionNames}
      />
    </Stack>
  );
};
export { PricingWidget };
