import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "@/hooks";
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
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
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

const PriceListPageWidget = ({ widgetType, isMobileScreen = false }) => {
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
    setPriceRecovery,
    onCloseMultiParameterModal,
    duplicateSection,
    removeSection,
    duplicateParameters,
    setProductTemplate,
    multiParameterModal,
    calculationServerErrorState,
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
    canCalculation,
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
    setIsFirstTimeEnterPageWhenEdit
  } = useDigitalOffsetPrice({ clasess, widgetType });

  const permissions = useRecoilValue(permissionsState);
  const router = useRouter();
  const visibleSections = productTemplate?.sections?.filter(
    (section) => !section.isHidden
  );
  const dir: "rtl" | "ltr" = t("direction");
  const theme = createTheme({
    direction: dir,
  });

  useEffect(() => {
    document.body.setAttribute("dir", dir);
  }, [dir]);
  const productSteps: StepType[] = [
    {
      selector: '[data-tour="a330193f-492c-40a8-86f3-8edf5c8f0d5e"]',
      content:
        "Please enter a name for the job. You can use any name you prefer, such as 'Test,' for example.",
      position: "bottom",
    },
    {
      selector: '[data-tour="de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"]',
      content:
        "Please specify the number of types (designs) required for the job. Let's start with one type.",
      position: "bottom",
    },
    {
      selector: '[data-tour="4991945c-5e07-4773-8f11-2e3483b70b53"]',
      content:
        "Please specify the number of types (designs) required for the job. Let's start with one type.",
      position: "bottom",
    },
    {
      selector: '[data-tour="e6cb1b69-d1f9-4319-85e8-4c2ae7c3e7de"]',
      content: "Now, please select a size for the product.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4"]',
      content: "Now, please select a size for the product.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="d7b058c4-0409-43e8-b446-8f70a7027a02"]',
      content: "Next, select the type of paper.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="c267ecb5-c774-4136-afef-3ed44c3c1f0f"]',
      content: " Please specify the paper weight.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="12bd74c2-46eb-408a-af8f-5b221fac96c4"]',
      content: "Please indicate the printing sides.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
      action: (elem) =>
        elem?.scrollIntoView({ behavior: "smooth", block: "end" }),
    },
    {
      selector: '[data-tour="5f4b6094-1dc5-40e4-81fd-e1294fca9d10"]',
      content: "Finally, specify the printing colors.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
      action: (elem) =>
        elem?.scrollIntoView({ behavior: "smooth", block: "end" }),
    },
    {
      selector: '[data-tour="product-pricing"]',
      content: "Here you can see the recommended final price for the job.",
      position: "bottom",
    },
    {
      selector: '[data-tour="next-button"]',
      content:
        'Before moving on to the pricing details, let\'s enhance the paper. Please press "Next" to continue.',
      position: "top",
    },
    {
      selector: '[data-tour="f80d6df9-e9be-4273-8947-34faaaded48c"]',
      content:
        'Let\'s incorporate a "Lamination"!\n tab here to open the lamination section.\n',
      position: "bottom",
    },
    {
      selector: '[data-tour="7ac619d4-196f-4610-88bb-082c1af586b8"]',
      content: "Please select the lamination sides required.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="e499e916-09a0-44f1-add5-01e8d869ae43"]',
      content: "And specify the lamination type.",
      position: "right",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="product-pricing"]',
      content:
        'Let\'s incorporate a "Lamination"! tab here to open the lamination section',
      position: "bottom",
    },
    {
      selector: '[data-tour="next-button"]',
      content:
        'Now, let\'s discuss the business aspect and how GoMake AI calculated the price. Please press "Next" to view the analysis.',
      position: "top",
    },
    {
      selector: '[data-tour="actions-container"]',
      content:
        "Here, you can view the recommended workflow.\n" +
        "A set price is determined by summing the cost\n" +
        "of operations and multiplying it by\n" +
        "the defined profit percentage",
      position: "top",
    },
    {
      selector: '[data-tour="allWorkflowsBtn"]',
      content:
        "Here, you can view the recommended workflow.\n" +
        "A set price is determined by summing the cost\n" +
        "of operations and multiplying it by\n" +
        "the defined profit percentage",
      position: "top",
    },
    {
      selector: '[data-tour="allWorkflowsContainer"]',
      content:
        "Here, you have the option to\n" +
        "change the selected workflow to\n" +
        "any other available workflow.",
      position: "top",
    },
    {
      selector: '[data-tour="addPricingBtn"]',
      content:
        "Let's proceed by adding the item to the quote.\n" +
        'Please press "Add" to navigate to the cart.',
      position: "top",
    },
  ];
  const { } = useGoMakeTour(productSteps, [relatedParameters]);
  const func = () => {
    getSelectedWorkFlow(currentSignalRConnectionId).then();
  };
  return (
    <div>
      {productTemplate?.sections?.length > 0 ? (
        <div style={clasess.mainContainer}>
          <HeaderTitle
            title={productTemplate?.name}
            marginTop={1}
            marginBottom={24}
          />
          <div style={clasess.mainRowContainer}>
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
                      overflow: "scroll",
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
                          ?.filter((x) => !x.isHidden)
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
                errorMsg={errorMsg}
                calculationProduct={calculationProduct}
                subProducts={subProducts}
                showCalculationInCompletedAlert={showCalculationInCompletedAlert}
                setCanCalculation={setCanCalculation}
                setIsFirstTimeEnterPageWhenEdit={setIsFirstTimeEnterPageWhenEdit}
              />
            )}
          </div>
          {/* buttons section */}
          <div style={clasess.buttonsContainer}>
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
                {activeIndex !== 0 && (
                  <SecondaryButton
                    variant="outlined"
                    onClick={handlePreviousClick}
                  >
                    {t("products.offsetPrice.admin.previousBtn")}
                  </SecondaryButton>
                )}

                {[
                  ...productTemplate?.sections,
                  ...(permissions.includes(Permissions.SHOW_PRICING_TAB)
                    ? [PricingTab]
                    : []),
                ].length -
                  1 !==
                  activeIndex && (
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
                    ...productTemplate?.sections,
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

            {!isMobileScreen && (
              <div
                style={{
                  width: 220,
                  height: 40,
                  marginLeft: 55,
                  marginRight: 55,
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
                      if (
                        DOCUMENT_TYPE.order ===
                        Number(router.query.documentType) &&
                        isFlowChanged && missionsListForEdit && missionsListForEdit.length > 0
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
                    disabled={isLoadingPrice}
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
    </div>
  );
};

export { PriceListPageWidget };
