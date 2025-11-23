import { TabsMappingWidget } from "@/pages-components/products/digital-offset-price/widgets/tabs-mapping";
import { GomakePrimaryButton, GoMakeDialog, GomakeTextInput } from "@/components";
import { useAddProduct } from "@/hooks";
import { ChildParameterModal } from "../child-parameter-modal";
import { useStyle } from "./style";
import { Tabs } from "@mui/material";
import { AccordionMappingWidget } from "./widgets/accordion-mapping";
import { SectionMappingWidget } from "./widgets/section-mapping";
import { GalleryModal, MultiParameterModal } from "../../digital-offset-price";
import { UpdateParameterModal } from "./widgets/update-parameter-modal";
import { ExternalValuesIdModal } from "../external-ids-modal";
import { useState } from "react";
import { Stack } from "@mui/material";

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
    removeProductParamete,
    productState,
    addSubSectionToProduct
  } = useAddProduct({ classes });

  const [isAddSubSectionDialogOpen, setIsAddSubSectionDialogOpen] = useState(false);
  const [subSectionName, setSubSectionName] = useState("");
  const [selectedSectionIdForSubSection, setSelectedSectionIdForSubSection] = useState<string | null>(null);

  const visibleSections = template?.sections;

  const CUSTOM_PRODUCT_TEMPLATE_ID = "a4b096a5-cf5a-4b72-a101-c79f5eccfef8";
  const isCustomProduct = productState?.templateId === CUSTOM_PRODUCT_TEMPLATE_ID ||
    (typeof productState?.templateId === "object" && productState?.templateId?.id === CUSTOM_PRODUCT_TEMPLATE_ID);

  console.log("visibleSections", { visibleSections, template });

  const handleOpenAddSubSectionDialog = (sectionId: string) => {
    setSelectedSectionIdForSubSection(sectionId);
    setSubSectionName("");
    setIsAddSubSectionDialogOpen(true);
  };

  const handleCloseAddSubSectionDialog = () => {
    setIsAddSubSectionDialogOpen(false);
    setSubSectionName("");
    setSelectedSectionIdForSubSection(null);
  };

  const handleAddSubSection = () => {
    if (!subSectionName.trim()) {
      return;
    }
    if (selectedSectionIdForSubSection) {
      addSubSectionToProduct(selectedSectionIdForSubSection, subSectionName.trim());
      handleCloseAddSubSectionDialog();
    }
  };


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
                      const showAddSubSectionButton = isCustomProduct;

                      return (
                        <div key={`section-${index}`}>
                          {showAddSubSectionButton && (
                            <div style={{
                              marginBottom: "20px"
                            }}>
                              <GomakePrimaryButton
                                onClick={() => handleOpenAddSubSectionDialog(section?.id)}
                                style={{ minWidth: "200px", height: "40px" }}
                              >
                                {t("products.addProduct.admin.addSubSection") || "Add SubSection"}
                              </GomakePrimaryButton>
                            </div>
                          )}
                          {section?.subSections?.map((subSection, subIndex) => {
                            if (subSection?.isAccordion) {
                              return (
                                <AccordionMappingWidget
                                  key={`accordion-${subIndex}`}
                                  index={subIndex}
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
                                  key={`section-mapping-${subIndex}`}
                                  index={subIndex}
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
                          })}
                        </div>
                      );
                    }
                    return null;
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
      <GoMakeDialog
        open={isAddSubSectionDialogOpen}
        onClose={handleCloseAddSubSectionDialog}
        title={t("products.addProduct.admin.addSubSection") || "Add SubSection"}
        onPrimaryAction={handleAddSubSection}
        primaryButtonLabel={t("sales.quote.add")}
        cancelButtonLabel={t("modal.cancel")}
        primaryButtonDisabled={!subSectionName.trim()}
        maxWidth="sm"
        fullWidth
      >
        <Stack gap={2} paddingTop={"10px"}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              {t("products.addProduct.admin.subSectionName") || "SubSection Name"}
            </div>
            <GomakeTextInput
              value={subSectionName}
              onChange={(e: any) => setSubSectionName(e.target.value)}
              placeholder={t("products.addProduct.admin.enterSubSectionName") || "Enter SubSection Name"}
              style={{ width: "100%", height: "40px" }}
            />
          </div>
        </Stack>
      </GoMakeDialog>
    </>
  );
};

export { ParameterWidget };
