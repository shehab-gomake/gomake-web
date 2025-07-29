import { Stack, ButtonGroup, Divider, Box, Tooltip, IconButton, Button } from "@mui/material";

import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { OutSourceSuppliers } from "@/widgets/product-pricing-widget/components/outsource-suppliers/out-source-suppliers-widget";
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
import { useRef, useEffect, useState } from "react";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { ActionsListMenu } from "./components/actions-menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SectionNameListMenu } from "./components/sections-menu";
import { ModalType } from "@/enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { _renderDeliveryDate } from "@/utils/helpers";
import { MobileActions } from "./components/action/mobile-action-component";
import { ChartsCostsComponent } from "./components/charts-costs/charts-costs-component";
import { useActionUpdateValues } from "./components/action/use-action-update-values";
import { HeaderLeftArrowIcon, HeaderRightArrowIcon } from "../partners/components/icons/arrow-icon";
import { BestSellerWhiteIcon } from "@/icons/best-seller-white";
import { adaptLeft, adaptPaddingLeft, adaptPaddingRight, adaptRight } from "@/utils/adapter";
import { CheckBoxAccordion } from "@/icons";
import CompareIcon from '@mui/icons-material/Compare';
import DynamicTable from "./dynamic-table";
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
    updateProductItemValue,
    setIsChangeView,
    selectedWorkFlow,
    getWorkFlowsActions,
    selectedWorkFlowsByTabList,
    pageSize,
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
    getCompareWorkFlows,
    isOpenCompareModal,
    compareWorkFlowsData
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
  const [selectedWorkFlowId, setSelectedWorkFlowId] = useState("");
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedCompareWorkFlow, setSelectedCompareWorkFlow] = useState<any>(null);


  // Add this function for compare logic
  const handleCompareTab = (section: any) => {
    getCompareWorkFlows(section)
  };

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

  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (buttonGroupRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = buttonGroupRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const buttonGroup = buttonGroupRef.current;
    if (buttonGroup) {
      buttonGroup.addEventListener('scroll', checkScrollButtons);
      return () => buttonGroup.removeEventListener('scroll', checkScrollButtons);
    }
  }, [calculationResult?.tabs]);



  const scrollToStart = () => {
    if (buttonGroupRef.current) {
      buttonGroupRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToEnd = () => {
    if (buttonGroupRef.current) {
      buttonGroupRef.current.scrollTo({
        left: buttonGroupRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  };
  const direction = t("direction");
  return (
    <Stack gap={"16px"} width={"100%"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        gap={"16px"}
      // style={{ display: "flex", flexWrap: "wrap", rowGap: "10px" }}
      >
        {!!workFlows ? (
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "67%" }}  >
            {canScrollLeft && (
              <div
                onClick={scrollToStart}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  minWidth: "36px",
                  height: "36px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  marginBottom: "10px",
                  marginRight: "5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#d0d7de";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              >
                <HeaderLeftArrowIcon />
              </div>
            )}
            <Box sx={classes.tabsContainerSx} style={classes.tabsContainer} ref={buttonGroupRef} >

              <ButtonGroup sx={classes.buttonGroup} orientation={"horizontal"}  >
                {workFlows.length > 0 && selectedWorkFlow && calculationResult &&
                  !isMobileScreen &&
                  calculationResult?.tabs?.map((section, index) => (
                    <div style={{ position: "relative", display: "inline-block" }} key={index}>
                      <PrimaryButton
                        key={index}
                        data-tour="allWorkflowsBtn"
                        onClick={() => {
                          if (section.isSelected) return;
                          if (isCompareMode) {
                            handleCompareTab(section);
                            setSelectedCompareWorkFlow(section);
                            setIsCompareMode(false);
                            return;
                          }
                          SelectWorkFlowById(section);
                          if (view === EPricingViews.OUTSOURCE_WORKFLOW) {
                            setView(EPricingViews.SELECTED_WORKFLOW);
                          }
                          setSelectedTab(section);
                        }}
                        sx={{
                          minWidth: "fit-content",
                          width: "fit-content",
                          borderRadius: 0,
                          border: 0,
                          flex: "1 1 auto",
                          whiteSpace: "nowrap",
                          letterSpacing: "0em",
                          transition: "0s",
                          position: "relative",
                          zIndex: 1,
                          "&:hover": {
                            minWidth: "fit-content",
                            flex: "1 1 auto",
                            borderRadius: 0,
                            letterSpacing: "0em",
                            transition: "0s",
                            border: "2px solid #2E3092",
                          },
                          ...(isCompareMode && !section.isSelected && {
                            border: "1px solid transparent",
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "linear-gradient(90deg, #2E3092, #fff, #2E3092, #fff, #2E3092)",
                              backgroundSize: "300% 300%",
                              borderRadius: "inherit",
                              zIndex: -1,
                              animation: "borderAnimation 2s linear infinite",
                            },
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: "2px",
                              left: "2px",
                              right: "2px",
                              bottom: "2px",
                              background: "white", // or your button's background color
                              borderRadius: "inherit",
                              zIndex: -1,
                            },
                            "@keyframes borderAnimation": {
                              "0%": {
                                backgroundPosition: "0% 50%",
                              },
                              "50%": {
                                backgroundPosition: "100% 50%",
                              },
                              "100%": {
                                backgroundPosition: "0% 50%",
                              },
                            },
                          }),
                        }}
                        style={{
                          letterSpacing: "0em",
                          transition: "0s",
                        }}
                        variant={
                          section.isSelected && view !== EPricingViews.OUTSOURCE_WORKFLOW
                            ? "contained"
                            : "outlined"
                        }
                        disabled={isCompareMode && section.isSelected}
                      >
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "4px", width: "100%" }}>
                          {section.isRecommendedBySystem && (
                            <div style={{ position: "absolute", ...adaptRight(t("direction"), 0), margin: 5 }}>
                              <BestSellerWhiteIcon />
                            </div>
                          )}
                          <div style={{ position: "relative", ...adaptPaddingRight(direction, 20), ...adaptPaddingLeft(direction, 20) }}>
                            {section.isNeedTranslation
                              ? t("workFlowTabs." + section.name)
                              : section.name}
                          </div>
                          {section.isSelected && (
                            <div style={{ position: "absolute", ...adaptLeft(t("direction"), 3), margin: 5, marginTop: 3 }}>
                              <CheckBoxAccordion />
                            </div>
                          )}
                        </div>
                      </PrimaryButton>
                    </div>
                  ))}
              </ButtonGroup>

            </Box>
            {workFlows.length > 0 && selectedWorkFlow && <PrimaryButton
              sx={{ ...classes.fixedOutSourceButton, marginBottom: (canScrollLeft || canScrollRight) ? "10px" : "0px", }}
              style={{
                letterSpacing: "0em",
                transition: "0s",
              }}
              variant={view === EPricingViews.OUTSOURCE_WORKFLOW ? "contained" : "outlined"}
              onClick={() => {
                setSelectedWorkFlowCalculatedIsLoaded(true);
                setView(EPricingViews.OUTSOURCE_WORKFLOW);
                updateProductItemValue(EWorkSource.OUT);
                setIsChangeView(false);
              }}
              disabled={isCompareMode}
            >
              {t("products.actions.outSource")}
              {view === EPricingViews.OUTSOURCE_WORKFLOW && (
                <div style={{ position: "absolute", ...adaptLeft(t("direction"), 3), margin: 5, marginTop: 3 }}>
                  <CheckBoxAccordion />
                </div>
              )}
            </PrimaryButton>}
            {/* Right Arrow Button */}
            {canScrollRight && (
              <div
                onClick={scrollToEnd}
                style={{
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  minWidth: "36px",
                  height: "36px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  marginBottom: "10px",
                  marginLeft: "5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#d0d7de";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              >
                <HeaderRightArrowIcon />
              </div>
            )}
          </div>
        ) : (
          <div />
        )}
        <Stack
          direction={"row"}
          gap={"10px"}
          alignItems={"center"}
          style={{ display: "flex", width: "30%", justifyContent: "flex-end" }}
        >
          {
            calculationResult?.tabs?.length > 1 &&
            <Tooltip title={t("Start comparison")} style={{ backgroundColor: "white" }}>
              <IconButton onClick={() => setIsCompareMode(!isCompareMode)}>
                <CompareIcon style={{ color: "rgb(236,3,141)" }} />
              </IconButton>
            </Tooltip>
          }
          {deliveryDate && workFlows.length > 0 && selectedWorkFlow && (
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
            {!isHasSubWorkFlowsOrProductTypeActions && workFlows.length > 0 && selectedWorkFlow &&
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
      <GoMakeModal
        openModal={isOpenCompareModal.isOpen}
        onClose={isOpenCompareModal.close}
        modalTitle={compareWorkFlowsData?.title ? compareWorkFlowsData?.title : t("pricingWidget.dynamicTable.compareModalTitle", {
          tabName: selectedWorkFlow?.tabName,
          name: selectedCompareWorkFlow?.name
        })}
        insideStyle={{
          width: "75%",
          height: "750px",
          padding: "20px",
        }}
      >
        <DynamicTable data={compareWorkFlowsData} />
      </GoMakeModal>
    </Stack>

  );
};
export { PricingWidget };
