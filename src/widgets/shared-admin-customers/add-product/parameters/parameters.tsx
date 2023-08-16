import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { HiddenIcon } from "../icons/hidden-icon";
import { NotHiddenIcon } from "../icons/not-hidden-icon";
import { RequierdIcon } from "../icons/requierd-icon";
import { NotRequierdIcon } from "../icons/not-requierd-icon";
import { useAddProduct } from "@/hooks";
import { DoneIcon, SettingIcon } from "../icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { EditIcon } from "../../digital-offset-price/icons";
import { ChildParameterModal } from "../child-parameter-modal";
import { useState } from "react";

const ParameterWidget = () => {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    updatedProductParameterHidden,
    updatedProductParameteRequierd,
    updatedProductParameteName,
    setChangeName,
    setChangeDefaultValue,
    updatedProductParameteDefaultValue,
    updatedProductParameteDefaultValueForSwitch,
    updatedProductParameterValuesConfigsHidden,
    updatedProductParameterValuesConfigsDefault,
    updatedValuesConfigsForParameters,
    activeIndex,
    template,
  } = useAddProduct();

  const [openModal, setOpenModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<any>({});

  const [selectedSectonId, setSelectedSectonId] = useState({});
  const [selectedSubSection, setSelectedSubSection] = useState({});
  const onCloseModal = () => {
    setSelectedParameter({});
    setOpenModal(false);
  };

  const onOpenModal = (parameter, sectionId, subSectionId) => {
    setSelectedParameter(parameter);
    setSelectedSectonId(sectionId);
    setSelectedSubSection(subSectionId);
    setTimeout(() => {
      setOpenModal(true);
    }, 100);
  };
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _renderParameterType = (sectionId, subSectionId, parameter) => {
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any) => setChangeDefaultValue(e.target.value)}
          onBlur={() =>
            updatedProductParameteDefaultValue(
              sectionId,
              subSectionId,
              parameter
            )
          }
          type="number"
        />
      );
    } else if (parameter?.parameterType === 2) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          type="text"
          onChange={(e: any) => setChangeDefaultValue(e.target.value)}
          onBlur={() =>
            updatedProductParameteDefaultValue(
              sectionId,
              subSectionId,
              parameter
            )
          }
        />
      );
    } else if (parameter?.parameterType === 0) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          value={defaultObject}
          onChange={(e: any, value: any) => {
            updatedProductParameterValuesConfigsDefault(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
          renderOption={(props: any, option: any) => {
            return (
              <div style={clasess.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div>
                  {option.isHidden ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <HiddenIcon />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <NotHiddenIcon />
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
          checked={parameter?.defaultValue}
          onChange={(a: any, value: any) => {
            updatedProductParameteDefaultValueForSwitch(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 4) {
      return (
        <GomakePrimaryButton style={clasess.dynamicBtn}>
          {parameter?.name}
        </GomakePrimaryButton>
      );
    } else if (parameter?.parameterType === 6) {
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          // value={defaultObject}
          onChange={(e: any, value: any) => {
            updatedProductParameterValuesConfigsDefault(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
          renderOption={(props: any, option: any) => {
            return (
              <div style={clasess.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div>
                  {option.isHidden ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <HiddenIcon />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <NotHiddenIcon />
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      );
    }
  };
  return (
    <>
      {template && (
        <>
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                {template?.sections.map((item, index) => {
                  return (
                    <div
                      style={clasess.tabContainer}
                      key={index}
                      onClick={() => handleTabClick(index)}
                    >
                      <div style={{ height: 22, minWidth: 30 }}>
                        {index === activeIndex ? (
                          <img
                            src={item.icon}
                            style={{
                              width: 30,
                              height: 24,
                            }}
                          />
                        ) : index >= activeIndex ? (
                          <img
                            src={item.icon}
                            style={{
                              width: 30,
                              height: 24,
                            }}
                          />
                        ) : (
                          <DoneIcon />
                        )}
                      </div>
                      <div
                        style={
                          index === activeIndex
                            ? clasess.tabNameActiveStyle
                            : clasess.tabNameStyle
                        }
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ height: "50vh", overflow: "scroll" }}>
                <div style={clasess.sectionsContainer}>
                  {template?.sections?.map((section, index) => {
                    if (index === activeIndex) {
                      return section?.subSections?.map((subSection, index) => {
                        if (subSection?.isAccordion) {
                          return (
                            <Accordion
                              expanded={expanded === `panel_${index}`}
                              onChange={handleChange(`panel_${index}`)}
                              key={index}
                            >
                              <AccordionSummary
                                style={
                                  expanded === `panel_${index}`
                                    ? clasess.activeTabContainer
                                    : null
                                }
                              >
                                <div style={clasess.headerAccordionContainer}>
                                  <EditIcon />
                                  <div
                                    style={
                                      expanded === `panel_${index}`
                                        ? clasess.subSectionAccordionActiveStyle
                                        : clasess.subSectionAccordionStyle
                                    }
                                  >
                                    {subSection.name}
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div style={clasess.parametersContainer}>
                                  {subSection?.parameters?.map(
                                    (parameter, index) => {
                                      return (
                                        <div key={index}>
                                          {!parameter?.isHidden ? (
                                            <div
                                              style={clasess.parameterContainer}
                                            >
                                              <div
                                                style={
                                                  clasess.parameterLabelStyle
                                                }
                                              >
                                                {parameter?.updatedName}
                                                {parameter?.isRequired ? (
                                                  <span
                                                    style={clasess.spanRequierd}
                                                  >
                                                    {" "}
                                                    *
                                                  </span>
                                                ) : null}
                                              </div>
                                              <div
                                                style={
                                                  clasess.renderParameterTypeContainer
                                                }
                                              >
                                                {_renderParameterType(
                                                  parameter,
                                                  subSection,
                                                  section
                                                )}
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          );
                        } else {
                          return (
                            <div
                              key={index}
                              style={clasess.subSectionContainer}
                            >
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
                                            {parameter?.parameterType === 6 && (
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
                                              parameter
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
