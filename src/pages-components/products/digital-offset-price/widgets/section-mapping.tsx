import { GomakePrimaryButton } from "@/components";
import { AddNewIcon } from "@/icons";
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
}: any) => {
  const { t } = useTranslation();
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

  const groupedParametersArray = Object.values(groupedParameters);

  console.log(groupedParametersArray);
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
                  {item?.map((parameter: any, index: number) => {
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
