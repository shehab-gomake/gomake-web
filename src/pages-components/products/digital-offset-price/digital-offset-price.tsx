import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "@/hooks";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { machineCategoriesState } from "@/store/machine-categories";
import { GomakePrimaryButton } from "@/components";
import { TabsMappingWidget } from "./widgets/tabs-mapping";
import { PricingSectionMappingWidget } from "./widgets/pricing-section-mapping";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { RightSideWidget } from "./widgets/right-side-widget";
import {
  ChooseShapeModal,
  MakeShapeModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import { EWidgetProductType } from "./enums";

const PriceListPageWidget = ({ widgetType }) => {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneMakeShape,
    onCloseChooseShape,
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
    priceRecovery,
    graphicNotes,
    printingNotes,
    urgentOrder,
    defaultPrice,
    makeShapeOpen,
    chooseShapeOpen,
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
    generalParameters,
    workFlowSelected,
    relatedParameters,
  } = useDigitalOffsetPrice({ clasess, widgetType });
  const machineCategories = useRecoilValue(machineCategoriesState);
  const [actionState, setActionState] = useState({});
  const onChangeCategoryData = (actionId, categoryId, value) => {
    setActionState({
      actionId,
      categoryId,
      value,
    });
  };
  return (
    <div
      style={{
        height: "100%",
        minHeight: "100%",
        maxHeight: "100%",
      }}
    >
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
              <div style={{ height: 700, overflow: "scroll", width: "100%" }}>
                <div style={clasess.sectionsContainer}>
                  {[...template?.sections, PricingTab]?.map(
                    (section: any, index: number) => {
                      if (index === activeIndex) {
                        if (section.name === "Pricing") {
                          return (
                            <PricingSectionMappingWidget
                              clasess={clasess}
                              machineCategories={machineCategories}
                              onChangeCategoryData={onChangeCategoryData}
                              section={section}
                              pricingDefaultValue={pricingDefaultValue}
                              workFlowSelected={workFlowSelected}
                            />
                          );
                        } else {
                          return section?.subSections?.map(
                            (subSection: any, index: number) => {
                              if (subSection?.isAccordion) {
                                return (
                                  <AccordionMappingWidget
                                    clasess={clasess}
                                    expanded={expanded}
                                    index={index}
                                    handleChange={handleChange}
                                    subSection={subSection}
                                    section={section}
                                    _renderParameterType={_renderParameterType}
                                    _getParameter={_getParameter}
                                  />
                                );
                              } else {
                                return (
                                  <SectionMappingWidget
                                    clasess={clasess}
                                    index={index}
                                    subSection={subSection}
                                    section={section}
                                    _renderParameterType={_renderParameterType}
                                    _getParameter={_getParameter}
                                    relatedParameters={relatedParameters}
                                    generalParameters={generalParameters}
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
              generalParameters={generalParameters}
              workFlowSelected={workFlowSelected}
              widgetType={widgetType}
              setPriceRecovery={setPriceRecovery}
              priceRecovery={priceRecovery}
            />
          </div>
          <MakeShapeModal
            openModal={makeShapeOpen}
            onClose={onCloseMakeShape}
            modalTitle={t("products.offsetPrice.admin.makeShape")}
          />
          <ChooseShapeModal
            openModal={chooseShapeOpen}
            onClose={onCloseChooseShape}
            modalTitle={t("products.offsetPrice.admin.chooseShape")}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "absolute",
              gap: 20,
              bottom: 0,
              right: 20,
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
    </div>
  );
};

export { PriceListPageWidget };
