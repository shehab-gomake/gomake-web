import { GomakePrimaryButton } from "@/components";
import { AddNewIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
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
}: any) => {
  const { t } = useTranslation();
  return (
    <div key={index} style={clasess.subSectionContainer}>
      {!isAccordion && (
        <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      )}
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
              <div key={index} style={{ display: "flex" }}>
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
      {subSection?.optionToDuplicateContent && (
        <GomakePrimaryButton
          style={clasess.duplicateSubSectionBtn}
          leftIcon={<AddNewIcon />}
        >
          {t("materials.buttons.addNew")} {subSection.name}
        </GomakePrimaryButton>
      )}
    </div>
  );
};

export { SectionMappingWidget };
