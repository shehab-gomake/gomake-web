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
    updatedProductParameterHidden,
    updatedProductParameteRequierd,
    updatedProductParameteName,
    setChangeName,
    setChangeDefaultValue,
    updatedProductParameteDefaultValue,
    updatedProductParameteDefaultValueForSwitch,
    updatedProductParameterValuesConfigsHidden,
    updatedProductParameterValuesConfigsDefault,
    activeIndex,
    template,
  } = useAddProduct();

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
          onChange={(e: any) => setChangeDefaultValue(e.target.value)}
          type="text"
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
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
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
          // onChange={(e, v) =>
          //   handleAutocompleteChange(e, v, parameter?.valuesConfigs)
          // }
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
