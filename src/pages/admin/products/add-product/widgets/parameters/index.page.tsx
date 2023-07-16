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
  } = useAddProduct();
  const _renderParameterType = (parameter) => {
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
          // onClick={onOpeneChooseShape}
        >
          {parameter?.name}
        </GomakePrimaryButton>
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
                {template?.sections?.map((section, index) => {
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
                                  <div style={clasess.parameterContainer}>
                                    <div style={clasess.parameterLabelStyle}>
                                      <div>
                                        <GomakeTextInput
                                          style={clasess.textInputWithoutStyle}
                                          defaultValue={parameter?.name}
                                          placeholder={parameter?.name}
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
                                      style={
                                        clasess.renderParameterTypeContainer
                                      }
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
      )}
    </>
  );
}
