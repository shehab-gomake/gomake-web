import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "@/hooks";
import { GomakePrimaryButton } from "@/components";
import { TabsMappingWidget } from "./widgets/tabs-mapping";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { RightSideWidget } from "./widgets/right-side-widget";
import {
  GalleryModal,
  MakeShapeModal,
  MultiParameterModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import { EWidgetProductType } from "./enums";
import { PricingWidget } from "@/widgets/product-pricing-widget/pricing-widget";
import { Tabs } from "@mui/material";

const PriceListPageWidget = ({ widgetType }) => {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneMakeShape,
    onCloseGalleryModal,
    onCloseMakeShape,
    handleChange,
    _renderParameterType,
    _getParameter,
    renderOptions,
    checkWhatRenderArray,
    navigateForRouter,
    updateQuoteItem,
    setUrgentOrder,
    setPrintingNotes,
    setGraphicNotes,
    setPriceRecovery,
    onCloseMultiParameterModal,
    duplicateSection,
    removeSection,
    duplicateParameters,
    setProductTemplate,
    multiParameterModal,
    settingParameters,
    priceRecovery,
    graphicNotes,
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
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
    errorMsg,
    relatedParameters,
    jobActions,
    workFlows,
    billingMethod,
    underParameterIds,
    setBillingMethod,
    samlleType,
    graphicDesigner,
    setGraphicDesigner,
    setSamlleType,
    getOutSourcingSuppliers,
    onChangeSubProductsForPrice,
    includeVAT,
    setIncludeVAT,
    isChargeForNewDie,
    setIsChargeForNewDie,
    straightKnife
  } = useDigitalOffsetPrice({ clasess, widgetType });
  return (
    <div>
      {productTemplate?.sections?.length > 0 && (
        <div style={clasess.mainContainer}>
          <div>
            <HeaderTitle
              title={productTemplate?.name}
              marginTop={1}
              marginBottom={24}
            />
          </div>
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                <Tabs variant="scrollable" scrollButtons={"auto"}>
                  {[...productTemplate?.sections, PricingTab]?.map(
                    (item, index) => {
                      return (
                        <TabsMappingWidget
                          key={`tab-${index}`}
                          clasess={clasess}
                          index={index}
                          handleTabClick={handleTabClick}
                          activeIndex={activeIndex}
                          item={item}
                          productTemplate={productTemplate}
                          onDuplicateSection={duplicateSection}
                          onRemoveSection={removeSection}
                          setProductTemplate={setProductTemplate}
                          isAdmin={false}
                        />
                      );
                    }
                  )}
                </Tabs>
              </div>

              <div style={{ height: 666, overflow: "scroll", width: "calc(100% - 330px)" }}>
                <div style={clasess.sectionsContainer}>
                  {[...productTemplate?.sections, PricingTab]?.map(
                    (section: any, index: number) => {
                      if (index === activeIndex) {
                        if (
                          section.name ===
                          t("products.offsetPrice.admin.Pricing")
                        ) {
                          return (
                            <PricingWidget
                              getOutSourcingSuppliers={getOutSourcingSuppliers}
                              actions={jobActions}
                              workFlows={workFlows}
                            />
                          );
                        } else {
                          return section?.subSections
                            ?.filter((x) => !x.isHidden)
                            .map((subSection: any, index: number) => {
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
                    }
                  )}
                </div>
              </div>
            </div>
            <RightSideWidget
              clasess={clasess}
              clientDefaultValue={clientDefaultValue}
              renderOptions={renderOptions}
              checkWhatRenderArray={checkWhatRenderArray}
              clientTypeDefaultValue={clientTypeDefaultValue}
              clientTypesValue={clientTypesValue}
              template={productTemplate}
              tabs={tabs}
              activeTab={activeTab}
              onOpeneMakeShape={onOpeneMakeShape}
              pricingDefaultValue={pricingDefaultValue}
              setUrgentOrder={setUrgentOrder}
              urgentOrder={urgentOrder}
              setPrintingNotes={setPrintingNotes}
              setGraphicNotes={setGraphicNotes}
              graphicNotes={graphicNotes}
              printingNotes={printingNotes}
              widgetType={widgetType}
              setPriceRecovery={setPriceRecovery}
              priceRecovery={priceRecovery}
              setSamlleType={setSamlleType}
              includeVAT={includeVAT}
              setIncludeVAT={setIncludeVAT}
              setBillingMethod={setBillingMethod}
              billingMethod={billingMethod}
              samlleType={samlleType}
              graphicDesigner={graphicDesigner}
              setGraphicDesigner={setGraphicDesigner}
              errorMsg={errorMsg}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              position: "fixed",
              // paddingRight: "15px",
              // ...adaptPaddingLeft(direction, 15),
              bottom: 0,
              right: 0,
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.08)",
              height: 65,
              zIndex: 5,
              backgroundColor: "#FFF",
            }}
          >
            <div style={{ width: "68%" }}>
              <div style={clasess.addPreviousContainer}>
                {activeIndex != 0 ? (
                  <GomakePrimaryButton
                    style={clasess.previousBtnStyle}
                    onClick={handlePreviousClick}
                  >
                    {t("products.offsetPrice.admin.previousBtn")}
                  </GomakePrimaryButton>
                ) : null}
                {[...productTemplate?.sections, PricingTab].length - 1 !=
                  activeIndex ? (
                  <GomakePrimaryButton
                    style={clasess.nextBtnStyle}
                    onClick={handleNextClick}
                  >
                    {t("products.offsetPrice.admin.nextBtn")}
                  </GomakePrimaryButton>
                ) : null}
              </div>
            </div>
            <div style={{ width: 220, height: 40, marginLeft: 55, marginRight: 55 }}>
              {widgetType === EWidgetProductType.EDIT ? (
                <GomakePrimaryButton
                  style={clasess.addOrderBtn}
                  onClick={updateQuoteItem}
                >
                  {t("materials.buttons.edit")}
                </GomakePrimaryButton>
              ) : (
                <GomakePrimaryButton
                  style={clasess.addOrderBtn}
                  onClick={navigateForRouter}
                >
                  {t("products.offsetPrice.admin.addOrder")}
                </GomakePrimaryButton>
              )}

              {/* <div style={clasess.errorMsgStyle}>{errorMsg}</div> */}
            </div>
          </div>
        </div>
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
      />
      <MultiParameterModal
        openModal={multiParameterModal}
        onClose={onCloseMultiParameterModal}
        modalTitle={""}
        settingParameters={settingParameters}
        _renderParameterType={_renderParameterType}
      />
    </div>
  );
};

export { PriceListPageWidget };
