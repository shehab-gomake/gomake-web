import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import {
  ChooseShapeModal,
  MakeShapeModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import { useDigitalOffsetPrice } from "@/hooks";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { useState } from "react";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { PricingSectionMappingWidget } from "./widgets/pricing-section-mapping";
import { RightSideWidget } from "./widgets/right-side-widget";
import { TabsMappingWidget } from "./widgets/tabs-mapping";
export default function DigitalOffsetPrice() {
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
    navigate,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    activeTab,
    tabs,
    defaultPrice,
    expanded,
    clientDefaultValue,
    clientTypeDefaultValue,
    clientTypesValue,
    PricingTab,
    pricingDefaultValue,
  } = useDigitalOffsetPrice({ clasess });
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
    <CustomerAuthLayout>
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
              title={t("products.offsetPrice.admin.title2")}
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
                                      _renderParameterType={
                                        _renderParameterType
                                      }
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
                                      _renderParameterType={
                                        _renderParameterType
                                      }
                                      _getParameter={_getParameter}
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
                <GomakePrimaryButton
                  style={clasess.addOrderBtn}
                  onClick={() => navigate("/quote")}
                >
                  {t("products.offsetPrice.admin.addOrder")}
                </GomakePrimaryButton>
                <div style={clasess.noVatStyle}>
                  {t("products.offsetPrice.admin.dontVAT")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerAuthLayout>
  );
}
