import { GomakePrimaryButton } from "@/components";
import { AddNewIcon } from "@/icons";
import { WastebasketNew } from "@/icons/wastebasket-new";
import cloneDeep from "lodash.clonedeep";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
}: any) => {
  const { t } = useTranslation();
  const [groupedParameters, setGroupedParameters] = useState<any>();
  const [groupedParametersArray, setGroupedParametersArray] = useState<any>();
  useEffect(() => {
    const groupedParameters = subSection?.parameters
      ?.filter((param: any) => !param.isHidden)
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
  const deleteDuplicateSection = (index) => {
    let temp = cloneDeep(template);
    const myId = subSection?.id;
    let temp2 = cloneDeep(groupedParametersArray);
    temp2.splice(index, 1);
    setGroupedParametersArray(temp2);
    let flattenedArray = [].concat(...temp2);
    temp.sections.forEach((section) => {
      section.subSections.forEach((subSection) => {
        if (subSection.id === myId) {
          subSection.parameters = flattenedArray;
        }
      });
    });
    setTemplate(temp);
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
                  {item?.map((parameter: any, index2: number) => {
                    const value = _getParameter(parameter, subSection, section);
                    return (
                      <div key={parameter?.id} style={{ display: "flex" }}>
                        {_renderParameterType(
                          parameter,
                          subSection,
                          section,
                          subSection?.parameters,
                          value,
                          subSection?.parameters,
                          true
                        )}
                      </div>
                    );
                  })}
                  {groupedParametersArray?.length > 1 && (
                    <div style={clasess.WastebasketNewStyle}>
                      <div style={{ width: "100%", height: 21 }} />
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteDuplicateSection(index)}
                      >
                        <WastebasketNew />
                      </div>
                    </div>
                  )}
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
            ?.filter((param: any) => {
              return !relatedParameters.some(
                (relatedParam) => relatedParam.parameterId === param.id
              );
            })
            ?.map((parameter: any, index: number) => {
              const value = _getParameter(parameter, subSection, section);
              return (
                <div key={parameter?.id} style={{ display: "flex" }}>
                  {_renderParameterType(
                    parameter,
                    subSection,
                    section,
                    subSection?.parameters,
                    value,
                    subSection?.parameters,
                    true
                  )}
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export { SectionMappingWidget };
