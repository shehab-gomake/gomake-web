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
import { ExternalValuesIdModal } from "../external-ids-modal";

const ParameterWidget = () => {
  const { classes } = useStyle();
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
    setSettingParameters,
    settingParameters,
    isMaterialParameter,
    setSelectedUpdateType,
    selectedUpdateType,
    handleCloseModal,
    isUpdateModalOpen,
    handleUpdateParametersValue,
    setDoNotAskNextTime,
    doNotAskNextTime,
    selectedSectionId,
    onOpenExternalIdsModal,
    onCloseExternalIdsModal,
    openExternalIdsModal,
    removeProductParamete
  } = useAddProduct({ classes });

  const visibleSections = template?.sections;

  return (
    <>
      {template && (
        <>
          <div style={classes.mainRowContainer}>
            <div style={classes.leftSideContainer}>
              <div style={classes.tabsContainer}>
                <Tabs variant="scrollable" scrollButtons={"auto"}>
                  {[...visibleSections].map((item, index) => {
                    return (
                      <TabsMappingWidget
                        key={`tab-${index}`}
                        classes={classes}
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
                <div style={classes.sectionsContainer}>
                  {[...visibleSections]?.map((section, index) => {
                    if (index === activeIndex) {
                      return section?.subSections?.map((subSection, index) => {
                        if (subSection?.isAccordion) {
                          return (
                            <AccordionMappingWidget
                              index={index}
                              expanded={expanded}
                              classes={classes}
                              handleChange={handleChange}
                              subSection={subSection}
                              onOpenModal={onOpenModal}
                              onOpenExternalIdsModal={onOpenExternalIdsModal}
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
                              getProductById={getProductById}
                              removeProductParamete={removeProductParamete}
                            />
                          );
                        } else {
                          return (
                            <SectionMappingWidget
                              index={index}
                              classes={classes}
                              subSection={subSection}
                              onOpenModal={onOpenModal}
                              onOpenExternalIdsModal={onOpenExternalIdsModal}
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
                              getProductById={getProductById}
                              removeProductParamete={removeProductParamete}
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
          <div style={classes.addPreviousContainer}>
            {activeIndex != 0 ? (
              <GomakePrimaryButton
                style={classes.previousBtnStyle}
                onClick={handlePreviousClick}
              >
                {t("products.offsetPrice.admin.previousBtn")}
              </GomakePrimaryButton>
            ) : null}
            {[...template?.sections].length - 1 != activeIndex ? (
              <GomakePrimaryButton
                style={classes.nextBtnStyle}
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
            _renderParameterType={_renderParameterType}
          />
          <ExternalValuesIdModal
            openModal={openExternalIdsModal}
            onClose={onCloseExternalIdsModal}
            parameter={selectedParameter}
            sectionId={selectedSectonId}
            subSectionId={selectedSubSection}
            getProductById={getProductById}
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
        onUpdate={() =>
          handleUpdateParametersValue(
            isMaterialParameter,
            selectedSectionId,
            selectedSubSectionId,
            selectedParameter,
            selectedOption,
            selectedUpdateType
          )
        }
        setDoNotAskNextTime={setDoNotAskNextTime}
        doNotAskNextTime={doNotAskNextTime}
      />
    </>
  );
};

export { ParameterWidget };
