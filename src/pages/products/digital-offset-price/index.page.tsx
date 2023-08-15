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
import { TabsMappingWidget } from "./widgets/tabs-mapping.page";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { PricingSectionMappingWidget } from "./widgets/pricing-section-mapping";
import { RightSideWidget } from "./widgets/right-side-widget";
import { templateMock } from "./data";
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
    renderOptions,
    checkWhatRenderArray,
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
  } = useDigitalOffsetPrice({ clasess });
  console.log("template", template);
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
      {template?.sections?.length > 0 && (
        <div style={clasess.mainContainer}>
          <HeaderTitle
            title={t("products.offsetPrice.admin.title2")}
            marginTop={50}
          />
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                {template?.sections?.map((item, index) => {
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
              <div
                style={{ height: "60vh", overflow: "scroll", width: "100%" }}
              >
                <div style={clasess.sectionsContainer}>
                  {template?.sections?.map((section: any, index: number) => {
                    if (index === activeIndex) {
                      if (section.name === "Pricing") {
                        return (
                          <PricingSectionMappingWidget
                            clasess={clasess}
                            machineCategories={machineCategories}
                            onChangeCategoryData={onChangeCategoryData}
                            section={section}
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
                                />
                              );
                            }
                          }
                        );
                      }
                    }
                  })}
                </div>
              </div>
              <div style={clasess.addPreviousContainer}>
                {activeIndex != 0 ? (
                  <GomakePrimaryButton
                    style={clasess.previousBtnStyle}
                    onClick={handlePreviousClick}
                  >
                    {t("products.offsetPrice.admin.previousBtn")}
                  </GomakePrimaryButton>
                ) : null}
                <GomakePrimaryButton
                  style={clasess.nextBtnStyle}
                  onClick={handleNextClick}
                >
                  {t("products.offsetPrice.admin.nextBtn")}
                </GomakePrimaryButton>
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
        </div>
      )}
    </CustomerAuthLayout>
  );
}
