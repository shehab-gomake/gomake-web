import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { useAddProduct } from "../../use-add-product";
import { HiddenIcon } from "../../icons/hidden-icon";
import { NotHiddenIcon } from "../../icons/not-hidden-icon";
import { RequierdIcon } from "../../icons/requierd-icon";
import { NotRequierdIcon } from "../../icons/not-requierd-icon";

export default function ParameterWidget() {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    activeIndex,
    template,
    tabs,
    activeTab,
  } = useAddProduct();
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
          renderOption={(props: any, option: any) => {
            if (option.label === t("materials.sheetPaper.addNew")) {
              return (
                <div
                  // onClick={onClickAddNewSupplier}
                  style={clasess.addSupplierAutoComplate}
                >
                  {t("materials.sheetPaper.addNewSupplier")}
                </div>
              );
            }
            return (
              <div style={clasess.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div style={clasess.flagsInDropDownContainer}>
                  {parameter?.isHidden ? <HiddenIcon /> : <NotHiddenIcon />}
                </div>
              </div>
            );
          }}
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
    }
  };
  return (
    <>
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
                          console.log("parameter", parameter);
                          return (
                            <div key={index}>
                              <div style={clasess.parameterContainer}>
                                <div style={clasess.parameterLabelStyle}>
                                  <div>
                                    <GomakeTextInput
                                      style={clasess.textInputWithoutStyle}
                                      defaultValue={parameter?.updatedName}
                                      placeholder={parameter?.updatedName}
                                    />
                                  </div>
                                  {parameter?.isHidden ? (
                                    <HiddenIcon />
                                  ) : (
                                    <NotHiddenIcon />
                                  )}
                                  {parameter?.isRequired ? (
                                    <RequierdIcon />
                                  ) : (
                                    <NotRequierdIcon />
                                  )}
                                </div>
                                <div
                                  style={clasess.renderParameterTypeContainer}
                                >
                                  {_renderParameterType(parameter)}
                                </div>
                              </div>
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
    </>
  );
}
