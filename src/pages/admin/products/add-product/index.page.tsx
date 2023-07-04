import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "./use-add-product";

import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { Checkbox, Tooltip } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";

export default function AddProduct() {
  const { clasess } = useStyle();
  const {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
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
                  <Tooltip title="is Hidden?">
                    <Checkbox
                      icon={<CheckboxIcon />}
                      checkedIcon={<CheckboxCheckedIcon />}
                      style={{ padding: 0, paddingTop: 8 }}
                      onClick={() => console.log("X", option)}
                    />
                  </Tooltip>
                  <Tooltip title="is Required?">
                    <Checkbox
                      icon={<CheckboxIcon />}
                      checkedIcon={<CheckboxCheckedIcon />}
                      style={{ padding: 0, paddingTop: 8 }}
                    />
                  </Tooltip>
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
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.addProduct.admin.title")} />
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
                                      <div>
                                        <GomakeTextInput
                                          style={clasess.textInputWithoutStyle}
                                          defaultValue={parameter?.updatedName}
                                          placeholder={parameter?.updatedName}
                                        />
                                      </div>
                                      <Tooltip title="is Hidden?">
                                        <Checkbox
                                          icon={<CheckboxIcon />}
                                          checkedIcon={<CheckboxCheckedIcon />}
                                          style={{ padding: 0, paddingTop: 8 }}
                                        />
                                      </Tooltip>
                                      <Tooltip title="is Required?">
                                        <Checkbox
                                          icon={<CheckboxIcon />}
                                          checkedIcon={<CheckboxCheckedIcon />}
                                          style={{ padding: 0, paddingTop: 8 }}
                                        />
                                      </Tooltip>
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
    </AdminAuthLayout>
  );
}
