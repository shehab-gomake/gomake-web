import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "@/hooks";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { machineCategoriesState } from "@/store/machine-categories";
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
import {PricingWidget} from "@/widgets/product-pricing-widget/pricing-widget";

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
    setDefaultPrice,
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
    setSamlleType,
    duplicateParameters,
    setTemplate,
    multiParameterModal,
    settingParameters,
    priceRecovery,
    graphicNotes,
    printingNotes,
    urgentOrder,
    defaultPrice,
    makeShapeOpen,
    GalleryModalOpen,
    activeIndex,
    template,
    tabs,
    activeTab,
    PricingTab,
    expanded,
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    pricingDefaultValue,
    errorMsg,
    workFlowSelected,
    relatedParameters,
      jobActions,
      workFlows,
      getOutSourcingSuppliers
  } = useDigitalOffsetPrice({ clasess, widgetType });
  return (
    <div style={{ height: "85vh" }}>
      {template?.sections?.length > 0 && (
        <div style={clasess.mainContainer}>
          <HeaderTitle
            title={template?.name}
            marginTop={24}
            marginBottom={24}
          />
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                {[...template?.sections, PricingTab]?.map((item, index) => {
                  return (
                    <TabsMappingWidget
                      key={`tab-${index}`}
                      clasess={clasess}
                      index={index}
                      handleTabClick={handleTabClick}
                      activeIndex={activeIndex}
                      item={item}
                    />
                  );
                })}
              </div>
              <div style={{ height: 666, overflow: "scroll", width: "100%" }}>
                <div style={clasess.sectionsContainer}>
                  {[...template?.sections, PricingTab]?.map(
                    (section: any, index: number) => {
                      if (index === activeIndex) {
                        if (section.name === "Pricing") {
                          return (
                            // <PricingSectionMappingWidget
                            //   clasess={clasess}
                            //   machineCategories={machineCategories}
                            //   onChangeCategoryData={onChangeCategoryData}
                            //   section={section}
                            //   pricingDefaultValue={pricingDefaultValue}
                            //   workFlowSelected={workFlowSelected}
                            // />
                              <PricingWidget getOutSourcingSuppliers={getOutSourcingSuppliers}  actions={jobActions} workFlows={workFlows}/>
                          );
                        } else {
                          return section?.subSections?.map(
                            (subSection: any, index: number) => {
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
                                    template={template}
                                    setTemplate={setTemplate}
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
                                    template={template}
                                    setTemplate={setTemplate}
                                  />
                                );
                              }
                            }
                          );
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
              template={template}
              setDefaultPrice={setDefaultPrice}
              defaultPrice={defaultPrice}
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
              workFlowSelected={workFlowSelected}
              widgetType={widgetType}
              setPriceRecovery={setPriceRecovery}
              priceRecovery={priceRecovery}
              setSamlleType={setSamlleType}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "fixed",
              paddingTop: "8px",
              gap: 20,
              bottom: 0,
              right: 20,
              boxShadow: "0px 1px 20px rgba(0, 0, 0, 0.08)",
              background: "#FFF",
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
                {[...template?.sections, PricingTab].length - 1 !=
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
            <div style={{ width: 330 }}>
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

              <div style={clasess.errorMsgStyle}>{errorMsg}</div>
              <div style={clasess.noVatStyle}>
                {t("products.offsetPrice.admin.dontVAT")}
              </div>
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
