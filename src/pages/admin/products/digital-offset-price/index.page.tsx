import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "./use-digital-offset-price";

import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import Image from "next/image";
import ImgProduct from "./icons/img.png";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from "@mui/material";
import { CheckboxCheckedIcon, EditIcon } from "@/icons";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { Progress } from "./icons/progress";
import { MakeShapeModal } from "./modals/make-shape-modal";
import { ChooseShapeModal } from "./modals/choose-shape-modal";
import { useState } from "react";
import { DoneIcon } from "./icons/done";
export default function Profits() {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onOpeneChooseShape,
    onOpeneMakeShape,
    onCloseChooseShape,
    onCloseMakeShape,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    activeTab,
    tabs,
  } = useDigitalOffsetPrice();
  const [expanded, setExpanded] = useState<string | false>("panel_0");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _renderParameterType = (parameter) => {
    console.log("parameterparameter", parameter);
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          // onChange={(e: any) => onChangeData(e.target.value)}
          type="number"
        />
      );
    } else if (parameter?.parameterType === 2) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          // onChange={(e: any) => onChangeData(e.target.value)}
          type="text"
        />
      );
    } else if (parameter?.parameterType === 0) {
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
        // checked={parameter?.IsDefault}
        // onChange={(a: any, value: any) => {
        //   onChangeSupplierToDefault(option, value);
        // }}
        />
      );
    } else if (parameter?.parameterType === 4) {
      return (
        <GomakePrimaryButton
          style={clasess.dynamicBtn}
          onClick={onOpeneChooseShape}
        >
          {parameter?.name}
        </GomakePrimaryButton>
      );
    }
  };
  const renderData = (data) => {
    if (data <= 3) {
      return "3%";
    } else if (data >= 97) {
      return "97%";
    } else return `${data}%`;
  };
  return (
    <AdminAuthLayout>
      {template && (
        <div style={clasess.mainContainer}>
          <HeaderTitle title={t("products.offsetPrice.admin.title2")} />
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={clasess.tabsContainer}>
                {template?.sections?.map((item, index) => {
                  return (
                    <div
                      style={clasess.tabContainer}
                      key={index}
                      onClick={() => handleTabClick(index)}
                    >
                      <div style={{ height: 22, minWidth: 30 }}>
                        <img
                          src={
                            index === activeIndex ? (
                              item.icon
                            ) : index >= activeIndex ? (
                              item.icon
                            ) : (
                              <DoneIcon />
                            )
                          }
                          style={{
                            width: 30,
                            height: 24,
                            // stroke: "red",
                          }}
                        />
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
              <div style={clasess.sectionsContainer}>
                {template?.sections?.map((section, index) => {
                  if (index === activeIndex) {
                    if (section.isAccordion) {
                      return section?.subSections?.map((subSection, index) => {
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
                                              {parameter?.name}
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
                                              {_renderParameterType(parameter)}
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
                      });
                    } else {
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
                                      {!parameter?.isHidden ? (
                                        <div style={clasess.parameterContainer}>
                                          <div
                                            style={clasess.parameterLabelStyle}
                                          >
                                            {parameter?.name}
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
                                            {_renderParameterType(parameter)}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      });
                    }
                  }
                })}
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
            <div style={clasess.rightSideContainer}>
              <div style={clasess.headerClientRightSide}>
                <div style={clasess.clientContainer}>
                  <div style={clasess.labelTextStyle}>Client</div>
                  <GoMakeAutoComplate
                    options={["q", "w"]}
                    placeholder={t("products.offsetPrice.admin.quote")}
                    style={clasess.dropDownListStyle}
                  />
                </div>
                <div style={clasess.typeContainer}>
                  <div style={clasess.labelTextStyle}>Type</div>
                  <GoMakeAutoComplate
                    options={["q", "w"]}
                    placeholder={t("products.offsetPrice.admin.client")}
                    style={clasess.dropDownListStyle}
                  />
                </div>
              </div>

              <div style={clasess.headerRightSide}>
                <div style={clasess.flyerText}>
                  {t("products.offsetPrice.admin.flyerPoster")}
                </div>
                <div style={clasess.flyerText}>2.00 USD</div>
              </div>
              <div style={clasess.imgProductContainer}>
                <Image
                  src={ImgProduct}
                  alt="gomake"
                  style={{ width: "100%" }}
                />
              </div>
              <div style={clasess.urgentEstimateContainer}>
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.takeEstimate", {
                    data: "5 days",
                  })}
                </div>
                <div style={clasess.urgentContainer}>
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                  />
                  <div style={clasess.secondText}>
                    {t("products.offsetPrice.admin.urgentOrder")}
                  </div>
                </div>
              </div>
              <div style={clasess.orderContainer}>
                {t("products.offsetPrice.admin.orderToral", {
                  pieceNum: "15",
                  price: "2.00",
                })}
              </div>
              <div style={clasess.progress}>
                <Progress width={"100%"} data={renderData(80)} />
              </div>
              <div style={clasess.labelBrogressContainer}>
                <div style={clasess.labelStyle}>10.00</div>
                <div style={clasess.labelStyle}>100.00</div>
              </div>
              <div style={clasess.totalContainer}>
                <div style={clasess.totalStyle}>
                  {t("products.offsetPrice.admin.total")}
                </div>
                <div style={clasess.totalStyle}>30.00 USD</div>
              </div>
              <div style={clasess.priceRecoveryContainer}>
                <Checkbox
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                />
                <div style={clasess.secondText}>
                  {t("products.offsetPrice.admin.priceRecovery")}
                </div>
              </div>

              <div style={clasess.switchAdditionsContainer}>
                <div style={clasess.additionsText}>
                  {t("products.offsetPrice.admin.additions")}
                </div>
                <div style={clasess.tabsTypesContainer}>
                  {tabs?.map((tab) => {
                    return (
                      <div
                        onClick={tab.onclick()}
                        style={
                          activeTab === tab.name
                            ? clasess.activeTabStyle
                            : clasess.unActiveTabStyle
                        }
                      >
                        {tab.name}
                      </div>
                    );
                  })}
                </div>
                {activeTab === "Production" ? (
                  <div style={clasess.productionStatus}>
                    <div style={clasess.sampleTypeStyle}>Sample type</div>
                    <div style={clasess.autoCompleteContainer}>
                      <GoMakeAutoComplate
                        options={["q", "w"]}
                        placeholder={t("products.offsetPrice.admin.quote")}
                        style={clasess.dropDownListStyle}
                      />
                    </div>
                    <div style={clasess.multiLineContainer}>
                      <GomakeTextInput
                        multiline={6}
                        style={clasess.multiLineTextInputStyle}
                        placeholder="Production comment"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={clasess.productionStatus}>
                    <div style={clasess.sampleTypeStyle}>Sample type</div>
                    <div style={clasess.autoCompleteContainer}>
                      <GoMakeAutoComplate
                        options={["q", "w"]}
                        placeholder={t("products.offsetPrice.admin.quote")}
                        style={clasess.dropDownListStyle}
                      />
                    </div>
                    <div style={clasess.multiLineContainer}>
                      <GomakeTextInput
                        multiline={6}
                        style={clasess.multiLineTextInputStyle}
                        placeholder="Graphic design comment"
                      />
                    </div>
                  </div>
                )}
              </div>

              <GomakePrimaryButton
                style={clasess.addOrderBtn}
                onClick={onOpeneMakeShape}
              >
                {t("products.offsetPrice.admin.addOrder")}
              </GomakePrimaryButton>
              <div style={clasess.noVatStyle}>
                {t("products.offsetPrice.admin.dontVAT")}
              </div>
            </div>
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
    </AdminAuthLayout>
  );
}
