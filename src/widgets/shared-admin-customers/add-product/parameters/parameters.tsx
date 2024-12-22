import { TabsMappingWidget } from "@/pages-components/products/digital-offset-price/widgets/tabs-mapping";
import { GomakePrimaryButton } from "@/components";
import { useAddProduct } from "@/hooks";
import { ChildParameterModal } from "../child-parameter-modal";
import { useStyle } from "./style";
import { Tabs } from "@mui/material";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { GalleryModal, MultiParameterModal } from "../../digital-offset-price";
import { UpdateParameterModal } from "./widgets/update-parameter-modal";
import { WorkFlowsWidget } from "../work-flows-widget";

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
    updatedProductParameterShowToClient,
    updatedProductParameteRequierd,
    updatedProductParameteLocked,
    updatedValuesConfigsForParameters,
    setTemplate,
    getProductById,
    activeIndex,
    template,
    selectedSubSection,
    selectedSectonId,
    selectedOption,
    selectedSubSectionId,
    selectedParameter,
    openModal,
    expanded,
    handleChange,
    relatedParameters,
    GalleryModalOpen,
    onCloseGalleryModal,
    straightKnife,
    multiParameterModal,
    onCloseMultiParameterModal,
    onOpeneMultiParameterModal,
    setSettingParameters,
    settingParameters,
    isMaterialParameter,
    setSelectedUpdateType,
    selectedUpdateType,
    handleCloseModal,
    isUpdateModalOpen,
    handleUpdateParametersValue,
    setDontAskNextTime,
    dontAskNextTime,
    selectedSectionId
  } = useAddProduct({ clasess });
  const visibleSections = template?.sections
  const WorkFlowsTab = {
    id: "c66465de-95d6-4ea3-bd3f-7efe6664cb0555",
    name: t("Work Flows"),
    icon: "pricing",
  };
  return (
    <>
      {template && (
        <>
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                <Tabs variant="scrollable" scrollButtons={"auto"}>
                  {[...visibleSections, WorkFlowsTab].map((item, index) => {
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
                className="custom-scrollbar"
                style={{ height: "55vh", overflow: "scroll", width: "100%" }}
              >
                <div style={clasess.sectionsContainer}>
                  {[...visibleSections, WorkFlowsTab]?.map((section, index) => {
                    if (index === activeIndex) {
                      if (
                        section.name === t("Work Flows")
                      ) {
                        return (
                          <WorkFlowsWidget />
                        )
                      } else {
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
                                updatedProductParameterShowToClient={
                                  updatedProductParameterShowToClient
                                }
                                updatedProductParameteRequierd={
                                  updatedProductParameteRequierd
                                }
                                updatedProductParameteLocked={
                                  updatedProductParameteLocked
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
                                updatedProductParameterShowToClient={
                                  updatedProductParameterShowToClient
                                }
                                updatedProductParameteRequierd={
                                  updatedProductParameteRequierd
                                }
                                updatedProductParameteLocked={
                                  updatedProductParameteLocked
                                }
                                _renderParameterType={_renderParameterType}
                                relatedParameters={relatedParameters}
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
      <GalleryModal
        openModal={GalleryModalOpen}
        onClose={onCloseGalleryModal}
        isParameterSettings={true}
        straightKnife={straightKnife}
        getProductById={getProductById}
        template={template}
      />
      <MultiParameterModal
        openModal={multiParameterModal}
        onClose={onCloseMultiParameterModal}
        settingParameters={settingParameters}
        _renderParameterType={_renderParameterType}
        isParameterSettings={true}
        setSettingParameters={setSettingParameters}
        getProductById={getProductById}
      />
      <UpdateParameterModal
        openModal={isUpdateModalOpen}
        onClose={handleCloseModal}
        selectedUpdateType={selectedUpdateType}
        setSelectedUpdateType={setSelectedUpdateType}
        onUpdate={() => handleUpdateParametersValue(isMaterialParameter, selectedSectionId, selectedSubSectionId, selectedParameter, selectedOption)}
        setDontAskNextTime={setDontAskNextTime}
        dontAskNextTime={dontAskNextTime}
      />
    </>
  );
};

export { ParameterWidget };
