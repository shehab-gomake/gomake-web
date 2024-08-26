import { CheckBoxAccordion, EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionMappingWidget } from "./section-mapping";
import { useRecoilValue } from "recoil";
import { subProductsParametersState } from "@/store";
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
  const parameterList = subProducts?.find(
    (x) => x.type === subSection?.type
  )?.parameters;
  const hasMatchingParameter = (parameterList, subSection) => {
    for (let param of subSection.parameters) {
      let matchingParameter = parameterList?.find(p =>
        p.parameterId === param.id && p.subSectionId === subSection.id
      );
      if (matchingParameter || param.oldSystemValue) {
        return true;
      }
    }
    return false;
  }
  const hasMatching = hasMatchingParameter(parameterList, subSection);
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
          expanded === `panel_${index}` ? hasMatching ? clasess.activeTabContainer2 : clasess.activeTabContainer : hasMatching ? clasess.activeTabContainer2 : null
        }
      >
        <div style={clasess.headerAccordionContainer}>
          {expanded === `panel_${index}` ? (
            hasMatching ? (
              <CheckBoxAccordion />
            ) : (
              <EditIcon stroke={"rgba(18, 19, 58, 1)"} />
            )
          ) : (
            hasMatching ? (
              <CheckBoxAccordion />
            ) :
              <EditIcon />
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
