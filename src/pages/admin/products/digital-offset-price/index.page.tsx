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
import { Checkbox } from "@mui/material";
import { CheckboxCheckedIcon } from "@/icons";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { Progress } from "./icons/progress";
import { MakeShapeModal } from "./modals/make-shape-modal";
import { ChooseShapeModal } from "./modals/choose-shape-modal";
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
  } = useDigitalOffsetPrice();
  const _renderParameterType = (parameter) => {
    if (parameter?.parameterType === "input") {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.updatedName}
          // onChange={(e: any) => onChangeData(e.target.value)}
        />
      );
    } else if (parameter?.parameterType === "select") {
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.updatedName}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
        />
      );
    } else if (parameter?.parameterType === "boolean") {
      return (
        <SecondSwitch
        // checked={parameter?.IsDefault}
        // onChange={(a: any, value: any) => {
        //   onChangeSupplierToDefault(option, value);
        // }}
        />
      );
    } else if (parameter?.parameterType === "button") {
      return (
        <GomakePrimaryButton
          style={clasess.dynamicBtn}
          onClick={onOpeneChooseShape}
        >
          {parameter?.updatedName}
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
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.offsetPrice.admin.title2")} />
        <div style={clasess.mainRowContainer}>
          <div style={clasess.leftSideContainer}>
            <div style={clasess.tabsContainer}>
              {template[0].sections.map((item, index) => {
                return (
                  <div
                    style={clasess.tabContainer}
                    key={index}
                    onClick={() => handleTabClick(index)}
                  >
                    <div style={{ height: 22, minWidth: 30 }}>
                      {index === activeIndex
                        ? item.activeIcon
                        : index >= activeIndex
                        ? item.icon
                        : item.doneIcon}
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
              {template[0]?.sections?.map((section, index) => {
                if (index === activeIndex) {
                  return section?.subSections?.map((subSection, index) => {
                    return (
                      <div key={index} style={clasess.subSectionContainer}>
                        <div style={clasess.subSectionTitleStyle}>
                          {subSection.name}
                        </div>
                        <div style={clasess.parametersContainer}>
                          {subSection?.parameters?.map((parameter, index) => {
                            return (
                              <div key={index}>
                                {!parameter?.isHidden ? (
                                  <div style={clasess.parameterContainer}>
                                    <div style={clasess.parameterLabelStyle}>
                                      {parameter?.updatedName}
                                      {parameter?.isRequired ? (
                                        <span style={clasess.spanRequierd}>
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
                          })}
                        </div>
                      </div>
                    );
                  });
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
            <div style={clasess.headerRightSide}>
              <div style={clasess.flyerText}>
                {t("products.offsetPrice.admin.flyerPoster")}
              </div>
              <div style={clasess.flyerText}>2.00 USD</div>
            </div>
            <div style={clasess.imgProductContainer}>
              <Image src={ImgProduct} alt="gomake" style={{ width: "100%" }} />
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
              <SecondSwitch size="small" />
              <div style={clasess.additionsText}>
                {t("products.offsetPrice.admin.additions")}
              </div>
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
          modalTitle="Make your own shape"
        />
        <ChooseShapeModal
          openModal={chooseShapeOpen}
          onClose={onCloseChooseShape}
          modalTitle="Choose shape"
        />
      </div>
    </AdminAuthLayout>
  );
}
