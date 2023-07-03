import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useDigitalOffsetPrice } from "./use-add-product";

import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";

export default function AddProduct() {
  const { clasess } = useStyle();
  const { t, handleTabClick, handleNextClick, activeIndex, template } =
    useDigitalOffsetPrice();
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
            {/* <button onClick={handleNextClick}>Next</button> */}
          </div>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
