import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

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
  Slider,
} from "@mui/material";
import { CheckboxCheckedIcon, EditIcon } from "@/icons";
import { useState } from "react";
import {
  ChooseShapeModal,
  MakeShapeModal,
} from "@/widgets/shared-admin-customers/digital-offset-price";
import {
  CheckboxIcon,
  DoneIcon,
} from "@/widgets/shared-admin-customers/digital-offset-price/icons";
import { useDigitalOffsetPrice } from "@/hooks";
import { useMaterials } from "@/hooks/use-materials";
import { useRecoilState } from "recoil";
import { digitslPriceState } from "@/hooks/shared-customer-admin/store";
export default function DigitalOffsetPrice() {
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
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
    onChangeForPrice,
    makeShapeOpen,
    chooseShapeOpen,
    activeIndex,
    template,
    activeTab,
    tabs,
    defaultPrice,
    setDefaultPrice,
  } = useDigitalOffsetPrice();
  const [expanded, setExpanded] = useState<string | false>("panel_0");
  // const { allMaterials } = useMaterials();
  // console.log(allMaterials);
  const allMaterials = [
    {
      pathName: "Sheets",
      data: [
        {
          valueId: "Paper Type",
          value: "Paper Type",
          pathName: "Weights",
          data: [
            {
              valueId: "aa257644-93a1-414f-a853-e881739935a9",
              value: "120gm",
              pathName: "Sizes",
              data: [
                {
                  valueId: "2b9d57ff-90ca-4520-910a-1c8caefe50bb",
                  value: "10X10",
                },
                {
                  valueId: "efd0e196-f960-49e7-a664-9d0d0a5a6a71",
                  value: "20X20",
                },
              ],
            },
            {
              valueId: "4f945175-658f-4dce-83e4-a69f796ed6ed",
              value: "150gm",
              pathName: "Sizes",
              data: [
                {
                  valueId: "978eaf75-982f-4e53-a9b2-63eb7325ea2a",
                  value: "30X30",
                },
                {
                  valueId: "e4abfeb3-a341-49a3-a61c-8375a0702b32",
                  value: "50X50",
                },
              ],
            },
          ],
        },
        {
          valueId: "Paper Type2",
          value: "Paper Type2",
          pathName: "Weights",
          data: [
            {
              valueId: "aa257644-93a1-414f-a853-e881739935a9",
              value: "125gm",
              pathName: "Sizes",
              data: [
                {
                  valueId: "2b9d57ff-90ca-4520-910a-1c8caefe50bb",
                  value: "10X10",
                },
                {
                  valueId: "efd0e196-f960-49e7-a664-9d0d0a5a6a71",
                  value: "20X20",
                },
              ],
            },
            {
              valueId: "4f945175-658f-4dce-83e4-a69f796ed6ed",
              value: "155gm",
              pathName: "Sizes",
              data: [
                {
                  valueId: "978eaf75-982f-4e53-a9b2-63eb7325ea2a",
                  value: "30X30",
                },
                {
                  valueId: "e4abfeb3-a341-49a3-a61c-8375a0702b32",
                  value: "50X50",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const _renderParameterType = (
    parameter: any,
    subSection: any,
    section: any
  ) => {
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any, item: any) =>
            onChangeForPrice(
              parameter?.ParamterId,
              subSection?.subSectionId,
              section?.sectionId,
              parameter?.parameterType,
              { value: e.target.value }
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
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.ParamterId,
              subSection?.subSectionId,
              section?.sectionId,
              parameter?.parameterType,
              { value: e.target.value }
            )
          }
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
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.ParamterId,
              subSection?.subSectionId,
              section?.sectionId,
              parameter?.parameterType,
              { valueId: value.valueId, valueName: value.updateName }
            )
          }
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
          // checked={parameter?.IsDefault}
          onChange={(e: any, value: any) =>
            onChangeForPrice(
              parameter?.ParamterId,
              subSection?.subSectionId,
              section?.sectionId,
              parameter?.parameterType,
              { value }
            )
          }
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
    } else if (parameter?.parameterType === 5) {
      let options: any = allMaterials;
      if (parameter?.materialPath?.length == 3) {
        options = digitalPriceData?.selectedMaterialLvl2;
      }
      if (parameter?.materialPath?.length == 2) {
        options = digitalPriceData?.selectedMaterialLvl1;
      }
      if (parameter?.materialPath?.length == 1) {
        options = allMaterials.find(
          (material) => material.pathName === parameter?.materialPath[0]
        )?.data;
      }
      return (
        options?.length > 0 && (
          <GoMakeAutoComplate
            options={options}
            placeholder={parameter.updatedName}
            style={clasess.dropDownListStyle}
            getOptionLabel={(option: any) => option.value}
            onChange={(e: any, value: any) => {
              if (parameter?.materialPath?.length == 3) {
                onChangeForPrice(
                  parameter?.ParamterId,
                  subSection?.subSectionId,
                  section?.sectionId,
                  parameter?.parameterType,
                  { valueId: value.valueId, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl3: value,
                  selectedOptionLvl3: value,
                });
              }
              if (parameter?.materialPath?.length == 2) {
                onChangeForPrice(
                  parameter?.ParamterId,
                  subSection?.subSectionId,
                  section?.sectionId,
                  parameter?.parameterType,
                  { valueId: value.valueId, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl2: value?.data,
                  selectedOptionLvl2: value,
                  selectedMaterialLvl3: null,
                });
              }
              if (parameter?.materialPath?.length == 1) {
                onChangeForPrice(
                  parameter?.ParamterId,
                  subSection?.subSectionId,
                  section?.sectionId,
                  parameter?.parameterType,
                  { valueId: value.valueId, valueName: value.value }
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl1: value?.data,
                  selectedOptionLvl1: value,
                  selectedMaterialLvl2: null,
                  selectedMaterialLvl3: null,
                });
              }
            }}
          />
        )
      );
    }
  };
  return (
    <CustomerAuthLayout>
      {template[0] && (
        <div style={clasess.mainContainer}>
          <HeaderTitle
            title={t("products.offsetPrice.admin.title2")}
            marginTop={50}
          />
          <div style={clasess.mainRowContainer}>
            <div style={clasess.leftSideContainer}>
              <div style={{ height: "66vh", overflow: "scroll" }}>
                <div style={clasess.tabsContainer}>
                  {template[0]?.sections?.map((item, index) => {
                    return (
                      <div>
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
                        {index === activeIndex && (
                          <div style={clasess.selectedTabLine} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={clasess.sectionsContainer}>
                  {template[0]?.sections?.map((section, index) => {
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
                            </div>
                          );
                        }
                      });
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

            <div style={clasess.rightSideContainer}>
              <div style={clasess.headerClientRightSide}>
                <div style={clasess.clientContainer}>
                  <div style={clasess.labelTextStyle}>
                    {t("products.offsetPrice.admin.client")}
                  </div>
                  <GoMakeAutoComplate
                    options={["q", "w"]}
                    placeholder={t("products.offsetPrice.admin.client")}
                    style={clasess.dropDownListStyle}
                  />
                </div>
                <div style={clasess.typeContainer}>
                  <div style={clasess.labelTextStyle}>
                    {t("products.offsetPrice.admin.type")}
                  </div>
                  <GoMakeAutoComplate
                    options={["q", "w"]}
                    placeholder={t("products.offsetPrice.admin.type")}
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
                <Slider defaultValue={50} aria-label="Default" />
              </div>
              <div style={clasess.labelBrogressContainer}>
                <div style={clasess.labelStyle}>10.00</div>
                <div style={clasess.labelStyle}>100.00</div>
              </div>
              <div style={clasess.totalContainer}>
                <div style={clasess.totalStyle}>
                  {t("products.offsetPrice.admin.total")}
                </div>
                <div style={clasess.totalStyle}>
                  <GomakeTextInput
                    value={defaultPrice}
                    onChange={(e: any) => setDefaultPrice(e.target.value)}
                    style={clasess.inputPriceStyle}
                  />{" "}
                  USD
                </div>
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
    </CustomerAuthLayout>
  );
}
