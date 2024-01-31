import { GomakePrimaryButton } from "@/components";
import { EParameterTypes } from "@/enums";
import { AddNewIcon } from "@/icons";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { subProductsParametersState } from "@/store";
import cloneDeep from "lodash.clonedeep";
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const SectionMappingWidget = ({
  clasess,
  index,
  subSection,
  section,
  _renderParameterType,
  _getParameter,
  relatedParameters,
  isAccordion,
  duplicateParameters,
  template,
  setTemplate,
  underParameterIds,
}: any) => {
  const { t } = useTranslation();
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const [groupedParameters, setGroupedParameters] = useState<any>();
  const [groupedParametersArray, setGroupedParametersArray] = useState<any>();
  useEffect(() => {
    const groupedParameters = subSection?.parameters
      ?.filter((param: any) => !param.isHidden)
      ?.filter((param: any) => !param.isUnderParameterId)
      ?.filter((param: any) => {
        return !relatedParameters.some(
          (relatedParam) => relatedParam.parameterId === param.id
        );
      })
      .reduce((result, parameter) => {
        const { actionIndex } = parameter;
        if (!result[actionIndex]) {
          result[actionIndex] = [];
        }
        result[actionIndex].push(parameter);
        return result;
      }, {});
    setGroupedParameters(groupedParameters);
  }, [subSection, relatedParameters]);
  useEffect(() => {
    if (groupedParameters && groupedParameters[0]?.length > 0) {
      setGroupedParametersArray(Object?.values(groupedParameters));
    }
  }, [groupedParameters]);

  const deleteDuplicateSection = (mySectionId, mySubSectionId, index) => {
    // 1. Delete the item from groupedParametersArray
    const updatedGroupedParametersArray = [...groupedParametersArray];
    updatedGroupedParametersArray.splice(index, 1);
    // 2. Delete parameters from the template
    const updatedTemplate = cloneDeep(template);
    const updatedTemplateCopy = JSON.parse(JSON.stringify(updatedTemplate));
    const sectionIndex = updatedTemplateCopy.sections.findIndex(
      (section) => section.id === mySectionId.id
    );

    if (sectionIndex !== -1) {
      const subSectionIndex = updatedTemplateCopy.sections[
        sectionIndex
      ].subSections.findIndex(
        (subSection) => subSection.id === mySubSectionId.id
      );
      if (subSectionIndex !== -1) {
        const updatedArray = updatedTemplateCopy.sections[
          sectionIndex
        ].subSections[subSectionIndex].parameters
          .map((param) => {
            if (param.actionIndex > index) {
              param.relatedParameters.forEach(
                (related) => (related.actionIndex = related.actionIndex - 1)
              );
              return { ...param, actionIndex: param.actionIndex - 1 };
            } else if (param.actionIndex === index) {
              return null; // Remove the parameter with actionIndex === index
            }
            return param;
          })
          .filter(Boolean);

        updatedTemplateCopy.sections[sectionIndex].subSections[
          subSectionIndex
        ].parameters = updatedArray;
      }
    }
    // 3. Delete parameters from subProducts
    const updatedSubProducts = subProducts.map((subProduct) => {
      if (subProduct.type === subSection.type) {
        return {
          ...subProduct,
          parameters: subProduct.parameters
            .map((parameter) => {
              if (parameter.actionIndex > index) {
                return { ...parameter, actionIndex: parameter.actionIndex - 1 };
              } else if (parameter.actionIndex === index) {
                return null; // Remove the parameter with actionIndex === index
              }
              return parameter;
            })
            .filter(Boolean),
        };
      }
      return subProduct;
    });
    setGroupedParametersArray(updatedGroupedParametersArray);
    setTemplate(updatedTemplateCopy);
    setSubProducts(updatedSubProducts);
  };
  return (
    <>
      <div key={index} style={clasess.subSectionContainer}>
        {!isAccordion && (
          <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
        )}
      </div>
      {subSection?.optionToDuplicateContent ? (
        <>
          {groupedParametersArray?.map((item: any, index: number) => {
            return (
              <>
                <div style={clasess.subSectionTitleStyle}>
                  {subSection.name} #{index + 1}
                </div>
                <div style={clasess.parametersContainer}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      gap: 10,
                    }}
                  >
                    <div>
                      {item?.map((parameter: any, index2: number) => {
                        const value = _getParameter(
                          parameter,
                          subSection,
                          section
                        );
                        return (
                          <React.Fragment>
                            {parameter.isStartNewLine ? <div style={{ flexBasis: '100%', height: 0 }}></div> : <></>}
                            <div
                              key={parameter?.id}
                              style={{
                                display: "flex",
                              }}
                            >
                              {_renderParameterType(
                                parameter,
                                subSection,
                                section,
                                subSection?.parameters,
                                value,
                                subSection?.parameters,
                                true,
                                false
                              )}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div>
                      {groupedParametersArray?.length > 1 && (
                        <div style={clasess.WastebasketNewStyle}>
                          <div style={{ width: "100%", height: 21 }} />
                          <div
                            style={{
                              cursor: "pointer",
                              height: 40,
                            }}
                            onClick={() =>
                              deleteDuplicateSection(section, subSection, index)
                            }
                          >
                            <WastebasketNew />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })}
          {subSection?.optionToDuplicateContent && (
            <GomakePrimaryButton
              style={clasess.duplicateSubSectionBtn}
              leftIcon={<AddNewIcon />}
              onClick={() => duplicateParameters(subSection)}
            >
              {t("materials.buttons.addNew")} {subSection.name}
            </GomakePrimaryButton>
          )}
        </>
      ) : (
        <div style={clasess.parametersContainer}>
          {subSection?.parameters
            ?.filter((param: any) => !param.isHidden)
            ?.filter((param: any) => !param.isUnderParameterId)
            ?.filter((param: any) => {
              return !relatedParameters.some(
                (relatedParam) => relatedParam.parameterId === param.id
              );
            })
            ?.map((parameter: any, index: number) => {
              const isUnderParameterId = underParameterIds.some(
                (item) => item.underParameterId === parameter.id
              );
              if (isUnderParameterId) {
                let list = subSection?.parameters
                const myParameter = underParameterIds.find(
                  (item) => item.underParameterId === parameter.id
                )?.myParameter;
                return (
                  <React.Fragment>
                    {parameter.isStartNewLine ? <div style={{ flexBasis: '100%', height: 0 }}></div> : <></>}
                    <div key={parameter?.id}>
                      {_renderParameterType(
                        parameter,
                        subSection,
                        section,
                        subSection?.parameters,
                        _getParameter(parameter, subSection, section),
                        subSection?.parameters,
                        true,
                        false
                      )}
                      <div style={{ marginTop: 5 }}>
                        {/* {_renderParameterType(
                          myParameter,
                          subSection,
                          section,
                          subSection?.parameters,
                          _getParameter(myParameter, subSection, section),
                          subSection?.parameters,
                          true,
                          true
                        )} */}
                        {
                          parameter.relatedParameters
                            .map((relatedParameter) => {
                              const filteredUnderParameterIds = underParameterIds.filter(
                                (underParam) =>
                                  underParam.myParameter?.id === relatedParameter.parameterId
                              );

                              return filteredUnderParameterIds.map((underParam) => {
                                const subProduct = subProducts.find(
                                  (x) => x.type === subSection?.type
                                );
                                const parm = subProduct?.parameters?.find(
                                  (param) =>
                                    param.parameterId === parameter.id &&
                                    param.actionIndex === relatedParameter.actionIndex
                                );
                                const myParameter = list.find(
                                  (p) =>
                                    p.id === relatedParameter.parameterId &&
                                    p.actionIndex === relatedParameter.actionIndex
                                );
                                if (relatedParameter.activateByAllValues && parm?.values) {
                                  return (
                                    <div>
                                      {_renderParameterType(
                                        myParameter,
                                        subSection,
                                        section,
                                        subSection?.parameters,
                                        _getParameter(myParameter, subSection, section),
                                        subSection?.parameters,
                                        true,
                                        true
                                      )}
                                    </div>
                                  );
                                } else {
                                  if (parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST) {
                                    const valueInArray = relatedParameter.selectedValueIds.find(
                                      (c) => c == parm?.valueIds
                                    );

                                    if (valueInArray) {
                                      return (
                                        <div>
                                          {_renderParameterType(
                                            myParameter,
                                            subSection,
                                            section,
                                            subSection?.parameters,
                                            _getParameter(myParameter, subSection, section),
                                            subSection?.parameters,
                                            true,
                                            true
                                          )}
                                        </div>
                                      );
                                    }
                                  } else {
                                    const valueInArray = relatedParameter.selectedValueIds.find(
                                      (c) => c == parm?.values
                                    );

                                    if (valueInArray && myParameter) {
                                      return (
                                        <div>
                                          {_renderParameterType(
                                            myParameter,
                                            subSection,
                                            section,
                                            subSection?.parameters,
                                            _getParameter(myParameter, subSection, section),
                                            subSection?.parameters,
                                            true,
                                            true
                                          )}
                                        </div>
                                      );
                                    }
                                  }
                                }
                              });
                            })
                        }
                      </div>
                    </div>
                  </React.Fragment>
                );
              } else {
                const value = _getParameter(parameter, subSection, section);
                return (
                  <React.Fragment>
                    {parameter.isStartNewLine ? <div style={{ flexBasis: '100%', height: 0 }}></div> : <></>}
                    <div key={parameter?.id} style={{ display: "flex", pageBreakBefore: parameter.isStartNewLine ? 'always' : 'unset' }}>
                      {_renderParameterType(
                        parameter,
                        subSection,
                        section,
                        subSection?.parameters,
                        value,
                        subSection?.parameters,
                        true,
                        false
                      )}
                    </div>
                  </React.Fragment>
                );
              }
            })}
        </div>
      )}
    </>
  );
};

export { SectionMappingWidget };
