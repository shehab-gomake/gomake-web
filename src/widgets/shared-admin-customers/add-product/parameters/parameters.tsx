import { TabsMappingWidget } from "@/pages-components/products/digital-offset-price/widgets/tabs-mapping";
import { GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useAddProduct } from "@/hooks";

import { ChildParameterModal } from "../child-parameter-modal";
import { NotRequierdIcon } from "../icons/not-requierd-icon";
import { NotHiddenIcon } from "../icons/not-hidden-icon";
import { RequierdIcon } from "../icons/requierd-icon";
import { HiddenIcon } from "../icons/hidden-icon";
import { SettingIcon } from "../icons";

import { useStyle } from "./style";
import { EParameterTypes } from "@/enums";
import { Tabs } from "@mui/material";

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
    updatedProductParameteName,
    setChangeName,
    updatedValuesConfigsForParameters,
    setTemplate,
    getProductById,
    activeIndex,
    template,
    selectedSubSection,
    selectedSectonId,
    selectedParameter,
    openModal,
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
              <div style={{ height: "50vh", overflow: "scroll" }}>
                <div style={clasess.sectionsContainer}>
                  {template?.sections?.map((section, index) => {
                    if (index === activeIndex) {
                      return section?.subSections?.map((subSection, index) => {
                        return (
                          <div key={index} style={clasess.subSectionContainer}>
                            <div style={clasess.subSectionTitleStyle}>
                              {subSection.name}
                            </div>
                            <div style={clasess.parametersContainer}>
                              {subSection?.parameters?.map(
                                (parameter, index) => {
                                  return (
                                    <div key={index}>
                                      <div style={clasess.parameterContainer}>
                                        <div
                                          style={clasess.parameterLabelStyle}
                                        >
                                          <div>
                                            <GomakeTextInput
                                              style={
                                                clasess.textInputWithoutStyle
                                              }
                                              defaultValue={parameter?.name}
                                              placeholder={parameter?.name}
                                              onChange={(e: any) =>
                                                setChangeName(e.target.value)
                                              }
                                              onBlur={() =>
                                                updatedProductParameteName(
                                                  section?.id,
                                                  subSection?.id,
                                                  parameter
                                                )
                                              }
                                            />
                                          </div>
                                          {parameter?.parameterType ===
                                            EParameterTypes.SELECT_CHILDS_PARAMETERS && (
                                            <div
                                              style={clasess.plusIconStyle}
                                              onClick={() =>
                                                onOpenModal(
                                                  parameter,
                                                  section?.id,
                                                  subSection?.id
                                                )
                                              }
                                            >
                                              <SettingIcon
                                                width={20}
                                                height={20}
                                              />
                                            </div>
                                          )}
                                          {parameter?.isHidden ? (
                                            <div
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                updatedProductParameterHidden(
                                                  section?.id,
                                                  subSection?.id,
                                                  parameter
                                                )
                                              }
                                            >
                                              <HiddenIcon />
                                            </div>
                                          ) : (
                                            <div
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                updatedProductParameterHidden(
                                                  section?.id,
                                                  subSection?.id,
                                                  parameter
                                                )
                                              }
                                            >
                                              <NotHiddenIcon />
                                            </div>
                                          )}
                                          {parameter?.isRequired ? (
                                            <div
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                updatedProductParameteRequierd(
                                                  section?.id,
                                                  subSection?.id,
                                                  parameter
                                                )
                                              }
                                            >
                                              <RequierdIcon />
                                            </div>
                                          ) : (
                                            <div
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                updatedProductParameteRequierd(
                                                  section?.id,
                                                  subSection?.id,
                                                  parameter
                                                )
                                              }
                                            >
                                              <NotRequierdIcon />
                                            </div>
                                          )}
                                        </div>
                                        <div
                                          style={
                                            clasess.renderParameterTypeContainer
                                          }
                                        >
                                          {_renderParameterType(
                                            section?.id,
                                            subSection?.id,
                                            parameter,
                                            subSection?.parameters
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
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

            <GomakePrimaryButton
              style={clasess.nextBtnStyle}
              onClick={handleNextClick}
            >
              {t("products.offsetPrice.admin.nextBtn")}
            </GomakePrimaryButton>
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
