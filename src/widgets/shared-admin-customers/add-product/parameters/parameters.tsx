import { TabsMappingWidget } from "@/pages-components/products/digital-offset-price/widgets/tabs-mapping";
import { GomakePrimaryButton } from "@/components";
import { useAddProduct } from "@/hooks";

import { ChildParameterModal } from "../child-parameter-modal";

import { useStyle } from "./style";
import { Tabs } from "@mui/material";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";

const ParameterWidget = () => {
  const { clasess } = useStyle();
  const {
    setSelectedParameter,
    onCloseModal,
    _renderParameterType,
    onOpenModal,
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    updatedProductParameterHidden,
    updatedProductParameteRequierd,
    updatedValuesConfigsForParameters,
    setTemplate,
    getProductById,
    activeIndex,
    template,
    selectedSubSection,
    selectedSectonId,
    selectedParameter,
    openModal,
    expanded,
    handleChange,
    relatedParameters,
  } = useAddProduct({ clasess });

  return (
    <>
      {template && (
        <>
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                <Tabs variant="scrollable" scrollButtons={"auto"}>
                  {template?.sections.map((item, index) => {
                    return (
                      <TabsMappingWidget
                        key={`tab-${index}`}
                        clasess={clasess}
                        index={index}
                        handleTabClick={handleTabClick}
                        activeIndex={activeIndex}
                        productTemplate={template}
                        setProductTemplate={setTemplate}
                        item={item}
                        isAdmin={true}
                        getProductById={getProductById}
                      />
                    );
                  })}
                </Tabs>
              </div>
              <div
                style={{ height: "50vh", overflow: "scroll", width: "100%" }}
              >
                <div style={clasess.sectionsContainer}>
                  {template?.sections?.map((section, index) => {
                    if (index === activeIndex) {
                      return section?.subSections?.map((subSection, index) => {
                        if (subSection?.isAccordion) {
                          return (
                            <AccordionMappingWidget
                              index={index}
                              expanded={expanded}
                              clasess={clasess}
                              handleChange={handleChange}
                              subSection={subSection}
                              onOpenModal={onOpenModal}
                              section={section}
                              updatedProductParameterHidden={
                                updatedProductParameterHidden
                              }
                              updatedProductParameteRequierd={
                                updatedProductParameteRequierd
                              }
                              _renderParameterType={_renderParameterType}
                              relatedParameters={relatedParameters}
                            />
                          );
                        } else {
                          return (
                            <SectionMappingWidget
                              index={index}
                              clasess={clasess}
                              subSection={subSection}
                              onOpenModal={onOpenModal}
                              section={section}
                              updatedProductParameterHidden={
                                updatedProductParameterHidden
                              }
                              updatedProductParameteRequierd={
                                updatedProductParameteRequierd
                              }
                              _renderParameterType={_renderParameterType}
                              relatedParameters={relatedParameters}
                            />
                          );
                        }
                      });
                    }
                  })}
                </div>
              </div>
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
            {[...template?.sections].length - 1 != activeIndex ? (
              <GomakePrimaryButton
                style={clasess.nextBtnStyle}
                onClick={handleNextClick}
              >
                {t("products.offsetPrice.admin.nextBtn")}
              </GomakePrimaryButton>
            ) : null}
          </div>
          <ChildParameterModal
            openModal={openModal}
            onClose={onCloseModal}
            selectedParameter={selectedParameter}
            modalTitle={`${selectedParameter?.name} values`}
            selectedSectonId={selectedSectonId}
            selectedSubSection={selectedSubSection}
            setSelectedParameter={setSelectedParameter}
            updatedValuesConfigsForParameters={
              updatedValuesConfigsForParameters
            }
          />
        </>
      )}
    </>
  );
};

export { ParameterWidget };
