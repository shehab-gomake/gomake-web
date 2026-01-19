import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice, useGomakeAxios, useSnackBar } from "@/hooks";
import {
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { TabsMappingWidget } from "./widgets/tabs-mapping";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { RightSideWidget, roundPrice } from "./widgets/right-side-widget";
import {
  GalleryModal,
  MakeShapeModal,
  MultiParameterModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import { Permissions } from "@/components/CheckPermission/enum";
import { EWidgetProductType } from "./enums";
import { PricingWidget } from "@/widgets/product-pricing-widget/pricing-widget";
import { createTheme, Tabs, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PriceListPageSkeletonWidget } from "./digital-offset-price-skeleton";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useRouter } from "next/router";
import React from "react";
import { MissionModalWidget } from "./widgets/mission-modal-widget";
import { ModalType } from "@/enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { permissionsState } from "@/store/permissions";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { SecondaryButton } from "@/components/button/secondary-button";
import { ErrorsModalWidget } from "./errors-modal-widget";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import { subProductsParametersState } from "@/store/general-parameters-state";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { getAllProductAndMaterialsApi } from "@/services/api-service/products/product-endpoints";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";
import { EditIcon } from "@/icons";
import { useSelectedProduct } from "@/hooks/shared-customer-admin/use-selected-product";

const PriceListPageWidget = ({
  widgetType,
  isMobileScreen = false,
  productId,
  sessionId,
  interactionId,
}: {
  widgetType: any;
  isMobileScreen?: boolean;
  productId?: string;
  sessionId?: string;
  interactionId?: string;
}) => {
  const { clasess } = useStyle({ isMobileScreen });
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onCloseGalleryModal,
    onCloseMakeShape,
    handleChange,
    _renderParameterType,
    _getParameter,
    navigateForRouter,
    updateQuoteItem,
    setUrgentOrder,
    setPrintingNotes,
    setQualityIssueReason,
    qualityIssueReason,
    setPriceRecovery,
    onCloseMultiParameterModal,
    duplicateSection,
    removeSection,
    duplicateParameters,
    setProductTemplate,
    multiParameterModal,
    settingParameters,
    setSettingParameters,
    priceRecovery,
    printingNotes,
    urgentOrder,
    makeShapeOpen,
    GalleryModalOpen,
    activeIndex,
    productTemplate,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    errorMsg,
    relatedParameters,
    jobActions,
    workFlows,
    underParameterIds,
    sampleType,
    setSampleType,
    getOutSourcingSuppliers,
    onChangeSubProductsForPrice,
    includeVAT,
    setIncludeVAT,
    isChargeForNewDie,
    setIsChargeForNewDie,
    straightKnife,
    isLoadingPrice,
    saveCurrentStation,
    onClickCloseCurrentStationModal,
    onClickOpenCurrentStationModal,
    missionsListForEdit,
    isFlowChanged,
    getSelectedWorkFlow,
    selectedWorkFlowCalculatedIsLoaded,
    setSelectedWorkFlowCalculatedIsLoaded,
    calculationProduct,
    subProducts,
    isOpenCreateDefaultWorkFlow,
    onClickCloseCreateDefaultWorkFlow,
    addItemForQuotes,
    sliderCurrentProductItemValueTotalPrice,
    systemCurrency,
    direction,
    setCanCalculation,
    showCalculationInCompletedAlert,
    showCalculationInCompletedModal,
    setShowCalculationInCompletedModal,
    currentSignalRConnectionId,
    deliveryDate,
    SelectWorkFlowById,
    isOpenErrorsModal,
    isButtonDisabledState,
    isProductCalculated,
  } = useDigitalOffsetPrice({
    clasess,
    widgetType,
    productId,
    sessionId,
    interactionId,
  });
  const { alertFault } = useSnackBar();
  const permissions = useRecoilValue(permissionsState);
  const router = useRouter();
  const visibleSections = productTemplate?.sections?.filter((section) => {
    const shouldHide = section.isHidden || section.hideFromUI;
    return !shouldHide;
  });
  const dir: "rtl" | "ltr" = t("direction");
  const theme = createTheme({
    direction: dir,
  });

  useEffect(() => {
    document.body.setAttribute("dir", dir);
  }, [dir]);

  const func = () => {
    getSelectedWorkFlow(currentSignalRConnectionId).then();
  };

  const {
    isEditProductMode,
    selectedProduct,
    combinedData,
    setSubProducts,
    handleProductChange,
    onCnClickSaveProductMode,
    onCnClickChangeProductMode,
    onCnClickEditProductMode
  } = useSelectedProduct();

  return (
    <div>
      {productTemplate?.sections?.length > 0 ? (
        <div style={clasess.mainContainer}>
          {
            isEditProductMode ? <>
              <div style={clasess.autoComplateRowContainer} >
                <div
                  data-tour="select-product"
                  style={{ width: "30%", marginBottom: 16 }}
                >
                  <GoMakeTreeSelect
                    value={selectedProduct}
                    options={combinedData}
                    onChange={(e) => {
                      setSubProducts([]);
                      handleProductChange(e, true);
                      onCnClickSaveProductMode();
                    }}
                    placeholder={t("home.admin.selectProductOrMaterial")}
                    selectedTab={ETab.PRODUCTS}
                    setSelectedTab={null}
                    hideOtherTabs={true}
                  />
                </div>
                <div onClick={onCnClickChangeProductMode} style={{ cursor: "pointer", marginTop: -6 }}>
                  <EditIcon />
                </div>
              </div>
            </> :
              <div onClick={onCnClickEditProductMode}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 23 }}>
                <HeaderTitle
                  title={productTemplate?.name}
                  marginTop={1}
                  marginBottom={1}
                />
                <div onClick={onCnClickChangeProductMode} style={{ cursor: "pointer", marginTop: 7 }}>
                  <EditIcon />
                </div>
              </div>

          }
          <div style={clasess.mainRowContainer} onClick={onCnClickSaveProductMode}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                <ThemeProvider theme={theme}>
                  <Tabs
                    variant="scrollable"
                    scrollButtons={"auto"}
                    TabScrollButtonProps={{
                      sx: {
                        "&.Mui-disabled": {
                          color: "grey",
                          opacity: 0.5,
                        },
                      },
                    }}
                  >
                    {[
                      ...visibleSections,
                      ...(permissions.includes(Permissions.SHOW_PRICING_TAB)
                        ? [PricingTab]
                        : []),
                    ]?.map((item, index) => (
                      <TabsMappingWidget
                        key={`tab-${index}`}
                        classes={clasess}
                        index={index}
                        handleTabClick={handleTabClick}
                        activeIndex={activeIndex}
                        item={item}
                        productTemplate={productTemplate}
                        onDuplicateSection={duplicateSection}
                        onRemoveSection={removeSection}
                        setProductTemplate={setProductTemplate}
                        isAdmin={false}
                        widgetType={widgetType}
                      />
                    ))}
                  </Tabs>
                </ThemeProvider>
              </div>
              <div
                className="custom-scrollbar"
                style={
                  !isMobileScreen
                    ? {
                      height: "calc(100vh - 300px)",
                      overflow: "scroll",
                      width: "calc(100% - 330px)",
                    }
                    : {
                      height: "calc(100vh - 260px)",
                      overflow: "auto",
                    }
                }
              >
                <div style={clasess.sectionsContainer}>
                  {[
                    ...visibleSections,
                    ...(permissions.includes(Permissions.SHOW_PRICING_TAB)
                      ? [PricingTab]
                      : []),
                  ]?.map((section, index) => {
                    if (index === activeIndex) {
                      if (
                        section.name === t("products.offsetPrice.admin.Pricing")
                      ) {
                        return (
                          <PermissionCheck
                            userPermission={Permissions.SHOW_PRICING_TAB}
                          >
                            <PricingWidget
                              isMobileScreen={isMobileScreen}
                              getOutSourcingSuppliers={getOutSourcingSuppliers}
                              actions={jobActions}
                              workFlows={workFlows}
                              widgetType={widgetType}
                              getSelectedWorkFlow={func}
                              SelectWorkFlowById={SelectWorkFlowById}
                              selectedWorkFlowCalculatedIsLoaded={
                                selectedWorkFlowCalculatedIsLoaded
                              }
                              setSelectedWorkFlowCalculatedIsLoaded={
                                setSelectedWorkFlowCalculatedIsLoaded
                              }
                              deliveryDate={deliveryDate}
                            />
                          </PermissionCheck>
                        );
                      } else {
                        return section?.subSections
                          ?.filter((x) => {
                            const shouldHide = x.isHidden || x.hideFromUI;
                            return !shouldHide;
                          })
                          .map((subSection, index) => {
                            if (subSection?.isAccordion) {
                              return (
                                <AccordionMappingWidget
                                  key={index}
                                  clasess={clasess}
                                  expanded={expanded}
                                  index={index}
                                  handleChange={handleChange}
                                  subSection={subSection}
                                  section={section}
                                  _renderParameterType={_renderParameterType}
                                  _getParameter={_getParameter}
                                  relatedParameters={relatedParameters}
                                  duplicateParameters={duplicateParameters}
                                  template={productTemplate}
                                  setTemplate={setProductTemplate}
                                  underParameterIds={underParameterIds}
                                />
                              );
                            } else {
                              return (
                                <SectionMappingWidget
                                  key={index}
                                  clasess={clasess}
                                  index={index}
                                  subSection={subSection}
                                  section={section}
                                  _renderParameterType={_renderParameterType}
                                  _getParameter={_getParameter}
                                  relatedParameters={relatedParameters}
                                  isAccordion={false}
                                  duplicateParameters={duplicateParameters}
                                  template={productTemplate}
                                  setTemplate={setProductTemplate}
                                  underParameterIds={underParameterIds}
                                />
                              );
                            }
                          });
                      }
                    }
                  })}
                </div>
              </div>
            </div>
            {!isMobileScreen && (
              <RightSideWidget
                clasess={clasess}
                template={productTemplate}
                tabs={tabs}
                activeTab={activeTab}
                setUrgentOrder={setUrgentOrder}
                urgentOrder={urgentOrder}
                setPrintingNotes={setPrintingNotes}
                printingNotes={printingNotes}
                widgetType={widgetType}
                setPriceRecovery={setPriceRecovery}
                priceRecovery={priceRecovery}
                setSampleType={setSampleType}
                includeVAT={includeVAT}
                setIncludeVAT={setIncludeVAT}
                sampleType={sampleType}
                qualityIssueReason={qualityIssueReason}
                setQualityIssueReason={setQualityIssueReason}
                errorMsg={errorMsg}
                calculationProduct={calculationProduct}
                subProducts={subProducts}
                showCalculationInCompletedAlert={
                  showCalculationInCompletedAlert
                }
                setCanCalculation={setCanCalculation}
              />
            )}
          </div>
          {/* buttons section */}
          <div
            style={
              productId && isMobileScreen
                ? clasess.aiButtonsContainer
                : clasess.buttonsContainer
            }
          >
            {isMobileScreen ? (
              <div
                style={{
                  ...clasess.addPreviousContainer,
                  padding: "0px 8px",
                  gap: "5px",
                }}
              >
                <div data-tour={"product-pricing"} style={clasess.totalStyle}>
                  {isLoadingPrice ? (
                    <DotsLoader />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <span style={clasess.totalCurrancyStyle}>
                        {systemCurrency}
                      </span>
                      <GomakeTextInput
                        disabled={true}
                        direction={direction}
                        value={
                          roundPrice(sliderCurrentProductItemValueTotalPrice) ??
                          "---------"
                        }
                        key={"TotalPriceInputMobile"}
                        style={clasess.inputPriceStyle}
                      />
                    </div>
                  )}
                </div>
                {activeIndex !== 0 && !isProductCalculated && (
                  <SecondaryButton
                    variant="outlined"
                    onClick={handlePreviousClick}
                  >
                    {t("products.offsetPrice.admin.previousBtn")}
                  </SecondaryButton>
                )}

                {[
                  ...visibleSections,
                  ...(permissions.includes(Permissions.SHOW_PRICING_TAB)
                    ? [PricingTab]
                    : []),
                ].length -
                  1 !==
                  activeIndex &&
                  !isProductCalculated && (
                    <div data-tour="next-button">
                      <SecondaryButton
                        variant="contained"
                        onClick={handleNextClick}
                      >
                        {t("products.offsetPrice.admin.nextBtn")}
                      </SecondaryButton>
                    </div>
                  )}
              </div>
            ) : (
              <div style={{ width: "68%" }}>
                <div style={clasess.addPreviousContainer}>
                  {activeIndex !== 0 && (
                    <GomakePrimaryButton
                      style={clasess.previousBtnStyle}
                      onClick={handlePreviousClick}
                    >
                      {t("products.offsetPrice.admin.previousBtn")}
                    </GomakePrimaryButton>
                  )}
                  {[
                    ...visibleSections,
                    ...(permissions.includes(Permissions.SHOW_PRICING_TAB)
                      ? [PricingTab]
                      : []),
                  ].length -
                    1 !==
                    activeIndex && (
                      <div data-tour="next-button">
                        <GomakePrimaryButton
                          style={clasess.nextBtnStyle}
                          onClick={handleNextClick}
                        >
                          {t("products.offsetPrice.admin.nextBtn")}
                        </GomakePrimaryButton>
                      </div>
                    )}
                </div>
              </div>
            )}

            {(!isMobileScreen || (isMobileScreen && isProductCalculated)) && (
              <div
                style={{
                  width: 220,
                  height: 40,
                  marginLeft: !isMobileScreen ? 55 : 10,
                  marginRight: !isMobileScreen ? 55 : 10,
                }}
              >
                {widgetType === EWidgetProductType.EDIT ? (
                  <GomakePrimaryButton
                    style={
                      isLoadingPrice
                        ? clasess.addOrderDisabledBtn
                        : clasess.addOrderBtn
                    }
                    onClick={() => {
                      if (isButtonDisabledState) {
                        alertFault("alerts.outOfAllowed");
                        return;
                      }

                      if (
                        DOCUMENT_TYPE.order ===
                        Number(router.query.documentType) &&
                        isFlowChanged &&
                        missionsListForEdit &&
                        missionsListForEdit.length > 0
                      ) {
                        onClickOpenCurrentStationModal();
                      } else {
                        updateQuoteItem();
                      }
                    }}
                    disabled={isLoadingPrice}
                  >
                    {t("sales.quote.edit")}
                  </GomakePrimaryButton>
                ) : !router?.query?.profitsProfileRowId ? (
                  <GomakePrimaryButton
                    data-tour="addPricingBtn"
                    style={
                      isLoadingPrice
                        ? clasess.addOrderDisabledBtn
                        : clasess.addOrderBtn
                    }
                    onClick={navigateForRouter}
                    disabled={
                      isLoadingPrice ||
                      widgetType === EWidgetProductType.CALCULATION_ERROR
                    }
                  >
                    {t("products.offsetPrice.admin.addOrderBtn")}
                  </GomakePrimaryButton>
                ) : (
                  <div></div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <PriceListPageSkeletonWidget isMobileScreen={isMobileScreen} />
      )}

      <MakeShapeModal
        openModal={makeShapeOpen}
        onClose={onCloseMakeShape}
        modalTitle={t("products.offsetPrice.admin.makeShape")}
      />
      <GalleryModal
        openModal={GalleryModalOpen}
        onClose={onCloseGalleryModal}
        onChangeSubProductsForPrice={onChangeSubProductsForPrice}
        isChargeForNewDie={isChargeForNewDie}
        setIsChargeForNewDie={setIsChargeForNewDie}
        straightKnife={straightKnife}
        isParameterSettings={false}
        _renderParameterType={_renderParameterType}
        template={productTemplate}
        _getParameter={_getParameter}
      />
      <MultiParameterModal
        openModal={multiParameterModal}
        onClose={onCloseMultiParameterModal}
        settingParameters={settingParameters}
        _renderParameterType={_renderParameterType}
        setSettingParameters={setSettingParameters}
        setCanCalculation={setCanCalculation}
      />

      {/* <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        subTitle={t("sales.quote.changePriceSubTitle")}
        title={t("sales.quote.changePriceTitle")}
        yesBtn={t("sales.quote.changedPrice")}
        cancelBtn={t("sales.quote.keepPrice")}
        openModal={isChangePriceForEdit}
        onClose={onClickCloseChangePriceModal}
        hideIcon
        onClickDelete={() => setIsChangePriceForEdit(false)}
        onClickCancel={() => {
          setCurrentProductItemValueTotalPrice(+lastProductItemValueTotalPrice);
          setSliderCurrentProductItemValueTotalPrice(+lastProductItemValueTotalPrice); //!new
          onClickCloseChangePriceModal();
        }}
      /> */}
      <GoMakeModal
        modalTitle={" "}
        withClose={false}
        openModal={saveCurrentStation}
        onClose={onClickCloseCurrentStationModal}
        insideStyle={{
          width: "55%",
          height: "fit-content",
          textAlign: "center",
          padding: 30,
        }}
      >
        <MissionModalWidget
          onClickCloseCurrentStationModal={onClickCloseCurrentStationModal}
          missionsListForEdit={missionsListForEdit}
          clasess={clasess}
          updateQuoteItem={updateQuoteItem}
        />
      </GoMakeModal>
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        subTitle={t("do you want to add this item to the cart. ?")}
        title={t("this product was not calculated and doesn't have a station ")}
        yesBtn={t("modal.yes")}
        openModal={isOpenCreateDefaultWorkFlow}
        onClose={onClickCloseCreateDefaultWorkFlow}
        onClickDelete={() => addItemForQuotes()}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        subTitle={t(
          "products.offsetPrice.admin.inCompletedProductAlertSubTitle"
        )}
        title={t("products.offsetPrice.admin.inCompletedProductAlertTitle")}
        yesBtn={t("modal.yes")}
        openModal={showCalculationInCompletedModal}
        onClose={() => setShowCalculationInCompletedModal(false)}
        onClickDelete={() => addItemForQuotes()}
      />
      <GoMakeModal
        modalTitle={" "}
        withClose={true}
        openModal={isOpenErrorsModal.isOpen}
        onClose={() => isOpenErrorsModal.close()}
        insideStyle={{
          width: "fit-content",
          height: "fit-content",
        }}
      >
        <ErrorsModalWidget
          errors={errorMsg}
          onClose={() => isOpenErrorsModal.close()}
          clasess={clasess} // Pass your classes if needed
        />
      </GoMakeModal>
    </div>
  );
};

export { PriceListPageWidget };
