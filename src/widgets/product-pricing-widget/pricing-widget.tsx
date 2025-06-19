import { Stack, ButtonGroup, Divider } from "@mui/material";

import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { OutSourceSuppliers } from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
import { InOutSourceSelect } from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import { SubWorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/sub-work-flow-component";
import { WorkFlowsComponent } from "@/widgets/product-pricing-widget/components/work-flow/work-flow-component";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import {
  EPricingViews,
  EWorkSource,
} from "@/widgets/product-pricing-widget/enums";
import { IPricingWidgetProps } from "@/widgets/product-pricing-widget/interface";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { usePricingWidget } from "./use-pricing-widget";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  calculationResultState,
  openModalMachineState,
  openModalMaterialState,
} from "./state";
import { useState } from "react";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeDeleteModal } from "@/components";
import { ActionsListMenu } from "./components/actions-menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SectionNameListMenu } from "./components/sections-menu";
import { ModalType, UNIT_TYPE } from "@/enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { _renderDeliveryDate } from "@/utils/helpers";
import { MobileActions } from "./components/action/mobile-action-component";
import { ChartsCostsComponent } from "./components/charts-costs/charts-costs-component";
import { useActionUpdateValues } from "./components/action/use-action-update-values";

const PricingWidget = ({
  workFlows,
  getOutSourcingSuppliers,
  widgetType,
  setSelectedWorkFlowCalculatedIsLoaded,
  selectedWorkFlowCalculatedIsLoaded,
  getSelectedWorkFlow,
  deliveryDate,
  isMobileScreen,
  SelectWorkFlowById
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
    setSectionNames,
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
    reOderSubWorkFlows,
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
  } = usePricingWidget({
    workFlows,
    getOutSourcingSuppliers,
    widgetType,
    selectedWorkFlowCalculatedIsLoaded,
    getSelectedWorkFlow,
  });
  const isHasSubWorkFlowsOrProductTypeActions =
    hasSubWorkFlowsOrProductTypeActions(selectedWorkFlow);
  const sectionNames = getSectionNames(selectedWorkFlow);
  const calculationResult = useRecoilValue(calculationResultState);
  console.log("calculationResult", calculationResult);
  const [selectedWorkFlowId, setSelectedWorkFlowId] = useState("");
  const [isUnderlined, setIsUnderlined] = useState(false);

  const [openModalMachine, setOpenModalMachine] = useRecoilState(
    openModalMachineState
  );
  const [openModalMaterial, setOpenModalMaterial] = useRecoilState(
    openModalMaterialState
  );
  const onClickCloseModalMachine = () => {
    setOpenModalMachine(false);
  };
  const onClickCloseModalMaterial = () => {
    setOpenModalMaterial(false);
  };

  const { updateWorkFlowForMachine, updateWorkFlowForMaterials } =
    useActionUpdateValues();
  return (
    <Stack gap={"16px"} width={"100%"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        style={{ display: "flex", flexWrap: "wrap", rowGap: "10px" }}
      >
        {!!workFlows && view !== EPricingViews.OUTSOURCE_WORKFLOW ? (
          <ButtonGroup sx={classes.buttonGroup} orientation={"horizontal"}>
            {/* <PrimaryButton
              onClick={() => {
                setView(EPricingViews.SELECTED_WORKFLOW);
                settledWorkFlowsByTabList([]);
              }}
              sx={classes.button}
              variant={
                view === EPricingViews.SELECTED_WORKFLOW
                  ? "contained"
                  : "outlined"
              }
            >
              {selectedWorkFlow?.tabName}
            </PrimaryButton> */}
            {calculationResult &&
              !isMobileScreen &&
              calculationResult?.tabs?.map((section, index) => (
                <PrimaryButton
                  key={index}
                  data-tour="allWorkflowsBtn"
                  onClick={() => {
                    SelectWorkFlowById(section);
                    // handleTabClick(section);
                    setSelectedTab(section);
                  }}
                  sx={classes.button}
                  variant={
                    section.isSelected
                      ? "contained"
                      : "outlined"
                  }
                >
                  {section.isNeedTranslation
                    ? t("workFlowTabs." + section.name)
                    : section.name}
                </PrimaryButton>
              ))}
          </ButtonGroup>
        ) : (
          <div />
        )}
        <Stack
          direction={"row"}
          gap={"10px"}
          alignItems={"center"}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {deliveryDate && (
            <Stack
              direction={"row"}
              gap={"10px"}
              alignItems={"center"}
              style={{ cursor: "pointer" }}
            >
              <span style={classes.detailTitle}>
                {t("home.headers.deliveryDate")}
              </span>
              <span style={classes.detailValue}>
                {_renderDeliveryDate(deliveryDate)}
              </span>
            </Stack>
          )}
          <PermissionCheck userPermission={Permissions.CUSTOMIZE_WORKFLOW}>
            {isHasSubWorkFlowsOrProductTypeActions &&
              view === EPricingViews.SELECTED_WORKFLOW &&
              !isMobileScreen && (
                <div
                  style={classes.autoCompleteSelectedSectionName}
                  onClick={(e) => {
                    handleOpenSectionNameListMenu(e);
                    setIsUnderlined(false);
                  }}
                >
                  {t("pricingWidget.addAction")}
                  <ArrowDropDownIcon />
                </div>
              )}
            {!isHasSubWorkFlowsOrProductTypeActions &&
              view === EPricingViews.SELECTED_WORKFLOW &&
              !isMobileScreen && (
                <div
                  style={classes.autoCompleteSelectedSectionName}
                  onClick={(e) => {
                    handleOpenActionsListMenu(e);
                    setIsUnderlined(true);
                  }}
                >
                  {t("pricingWidget.addAction")}
                  <ArrowDropDownIcon />
                </div>
              )}
          </PermissionCheck>

          <InOutSourceSelect
            onChange={(v: EWorkSource) => {
              setSelectedWorkFlowCalculatedIsLoaded(true);
              setView(
                v === EWorkSource.OUT
                  ? EPricingViews.OUTSOURCE_WORKFLOW
                  : EPricingViews.SELECTED_WORKFLOW
              );
              updateProductItemValue(v);
              setIsChangeView(false);
            }}
            disabled={!selectedWorkFlow}
            withPartially={
              selectedWorkFlow?.actions?.some(
                (action) => action.source === EWorkSource.OUT
              ) &&
              view !== EPricingViews.OUTSOURCE_WORKFLOW &&
              !selectedWorkFlowCalculatedIsLoaded
            }
            value={
              view === EPricingViews.OUTSOURCE_WORKFLOW
                ? EWorkSource.OUT
                : EWorkSource.INTERNAL
            }
          />
        </Stack>
      </Stack>

      {selectedWorkFlow && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ flex: 1 }}>
            <GeneralInformationComponent
              details={selectedWorkFlow?.generalInformation}
              details2={selectedWorkFlow?.generalInformationProductionFloor}
            />
          </div>
          <PermissionCheck
            userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}
          >
            <div
              style={{
                width: "20%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: "10px",
                alignSelf: "flex-start",
                paddingTop: "0px",
                minWidth: 330,
              }}
            >
              <ChartsCostsComponent selectedWorkFlow={selectedWorkFlow} />
            </div>
          </PermissionCheck>
        </div>
      )}
      <Divider />

      {selectedWorkFlow && view === EPricingViews.SELECTED_WORKFLOW && (
        <div
          data-tour={"actions-container"}
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {/* waiting */}
          <SubWorkFlowsComponent
            widgetType={widgetType}
            isEditableActions={true}
            workflows={selectedWorkFlow?.subWorkFlows || []}
            reOderMainActions={reOderMainActions}
            reOderSubWorkFlows={reOderSubWorkFlows}
            customer={customer}
            setCustomer={setCustomer}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            isFetching={isFetching}
          />
          {isMobileScreen ? (
            <MobileActions
              actions={selectedWorkFlow?.actions}
              productType={selectedWorkFlow.productType}
              widgetType={widgetType}
              selectedWorkFlowCalculatedIsLoaded={
                selectedWorkFlowCalculatedIsLoaded
              }
            />
          ) : (
            <Actions
              actions={selectedWorkFlow?.actions}
              productType={selectedWorkFlow.productType}
              widgetType={widgetType}
              selectedWorkFlowCalculatedIsLoaded={
                selectedWorkFlowCalculatedIsLoaded
              }
              reOderMainActions={reOderMainActions}
              customer={customer}
              setCustomer={setCustomer}
              renderOptions={renderOptions}
              checkWhatRenderArray={checkWhatRenderArray}
              isFetching={isFetching}
            />
          )}
        </div>
      )}

      {/* waiting */}
      {selectedWorkFlowsByTabList?.length > 0 &&
        view === EPricingViews.OTHERS_WORKFLOWS && (
          <div data-tour={"allWorkflowsContainer"}>
            <WorkFlowsComponent
              isMobileScreen={isMobileScreen}
              showSelected={() => setView(EPricingViews.SELECTED_WORKFLOW)}
              workflows={selectedWorkFlowsByTabList}
              getWorkFlowsActions={getWorkFlowsActions}
              selectedWorkFlowId={selectedWorkFlowId}
              setSelectedWorkFlowId={setSelectedWorkFlowId}
              widgetType={widgetType}
              customer={customer}
              setCustomer={setCustomer}
              renderOptions={renderOptions}
              checkWhatRenderArray={checkWhatRenderArray}
              isFetching={isFetching}
            />
            {pageSize < allCountSelectedTabWorkFlow && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    ...FONT_FAMILY.Lexend(500, 14),
                    cursor: "pointer",
                    color: "#2E3092",
                  }}
                  onClick={handleScroll}
                >
                  {t("sales.quote.showMore")}{" "}
                  <ReadMoreIcon style={{ color: "#2E3092" }} />
                </div>
              </>
            )}
          </div>
        )}
      {view === EPricingViews.OUTSOURCE_WORKFLOW && (
        <OutSourceSuppliers
          widgetType={widgetType}
          onClickAddOutSourceAction={onClickAddOutSourceAction}
          selectedWorkFlow={selectedWorkFlow}
          selectedWorkFlowCalculatedIsLoaded={
            selectedWorkFlowCalculatedIsLoaded
          }
          onClickRemoveOutSourceAction={onClickRemoveOutSourceAction}
        />
      )}
      <GoMakeDeleteModal
        modalType={ModalType.ADD}
        openModal={isAddNewAction}
        onClose={onClickCloseAddNewAction}
        onClickDelete={onClickAddActionToWorkFlow}
      />
      <ActionsListMenu
        handleClose={handleCloseActionsListMenu}
        open={openActionsListMenu}
        anchorEl={anchorElActionsListMenu}
        actionListDropDown={actionListDropDown}
        setActionNameSelected={setActionNameSelected}
        onClickAddNewAction={onClickAddNewAction}
        handleCloseSectionNameListMenu={handleCloseSectionNameListMenu}
        isUnderlined={isUnderlined}
      />
      <SectionNameListMenu
        handleClose={handleCloseSectionNameListMenu}
        open={openSectionNameListMenu}
        anchorEl={anchorElSectionNameListMenu}
        handleOpen={handleOpenActionsListMenu}
        sectionNames={[
          ...sectionNames,
          {
            sectionName: t("pricingWidget.general"),
            productType: null,
          },
        ]}
        setSectionNames={setSectionNames}
      />
      <GoMakeDeleteModal
        modalType={ModalType.ADD}
        insideStyle={classes.insideStyle}
        openModal={openModalMachine}
        onClose={onClickCloseModalMachine}
        title={t("pricingWidget.machineMsg")}
        hideIcon={true}
        yesBtn={t("modal.confirm")}
        onClickDelete={updateWorkFlowForMachine}
      />
      <GoMakeDeleteModal
        modalType={ModalType.ADD}
        insideStyle={classes.insideStyle}
        openModal={openModalMaterial}
        onClose={onClickCloseModalMaterial}
        title={t("pricingWidget.materialMsg")}
        hideIcon={true}
        yesBtn={t("modal.confirm")}
        onClickDelete={updateWorkFlowForMaterials}
      />
    </Stack>
  );
};
export { PricingWidget };
