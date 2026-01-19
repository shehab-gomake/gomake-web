import { CheckBoxAccordion, EditIcon, WarnIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionMappingWidget } from "./section-mapping";
import { useRecoilValue } from "recoil";
import { subProductsParametersState } from "@/store";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const AccordionMappingWidget = ({
  clasess,
  expanded,
  index,
  handleChange,
  subSection,
  section,
  _renderParameterType,
  _getParameter,
  relatedParameters,
  duplicateParameters,
  template,
  setTemplate,
  underParameterIds,
}: any) => {
  const subProducts = useRecoilValue<any>(subProductsParametersState);
  const { primarySecondaryBlend } = useGomakeTheme();
  const parameterList = subProducts?.find(
    (x) => x.type === subSection?.type
  )?.parameters;
  const hasMatchingParameter = (parameterList) => {
    for (let param of subSection.parameters) {
      let matchingParameter = parameterList?.find(
        (p) => p.parameterId === param.id && p.subSectionId === subSection.id && !param.isHiddenInSetting
      );
      if (matchingParameter || param.oldSystemValue) {
        return true;
      }
    }
    return false;
  };
  const hasMissingRequiredParameters = (parameterList) => {
    if (Array.isArray(subSection?.parameters)) {
      const subProductParameters = parameterList || [];
      const subProductParameterCodes = subProductParameters.map(p => p.parameterCode);
      const subProductParameterSubSectionIds = subProductParameters.map(p => p.subSectionId);
      for (const parameter of subSection.parameters) {
        if (
          parameter.isRequired && !parameter.isHidden && !parameter.isHiddenInSetting &&
          !subProductParameterCodes.includes(parameter.code)
          // &&
          // subProductParameterSubSectionIds.includes(subSection.id)
        ) {
          return true;
        }
      }
    }
    else {
      return false;
    }
  };
  const hasMissing = hasMissingRequiredParameters(parameterList);
  const hasMatching = hasMatchingParameter(parameterList);

  return (
    <Accordion
      expanded={expanded === `panel_${index}`}
      onChange={handleChange(`panel_${index}`)}
      key={index}
    >
      <AccordionSummary
        data-tour={subSection?.id}
        expandIcon={<ExpandMoreIcon />}
        style={
          expanded === `panel_${index}`
            ? hasMissing ? clasess.activeTabContainer3 : hasMatching
              ? clasess.activeTabContainer2
              : clasess.activeTabContainer
            : hasMissing ? clasess.activeTabContainer3 : hasMatching ? clasess.activeTabContainer2 : null
        }
      >
        <div style={clasess.headerAccordionContainer}>
          {expanded === `panel_${index}` ? (
            hasMissing ? (
              <WarnIcon />
            ) : hasMatching ? (
              <CheckBoxAccordion />
            ) : (
              <EditIcon stroke={"rgba(18, 19, 58, 1)"} />
            )
          ) :
            hasMissing ? (
              <WarnIcon />
            ) : hasMatching ? (
              <CheckBoxAccordion />
            ) : (
              <EditIcon stroke={primarySecondaryBlend(500)} />
            )}

          <div
            style={
              expanded === `panel_${index}`
                ? clasess.subSectionAccordionActiveStyle
                : clasess.subSectionAccordionStyle
            }
          >
            {subSection.name}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <SectionMappingWidget
          clasess={clasess}
          index={index}
          subSection={subSection}
          section={section}
          _renderParameterType={_renderParameterType}
          _getParameter={_getParameter}
          relatedParameters={relatedParameters}
          isAccordion={true}
          duplicateParameters={duplicateParameters}
          template={template}
          setTemplate={setTemplate}
          underParameterIds={underParameterIds}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionMappingWidget };
