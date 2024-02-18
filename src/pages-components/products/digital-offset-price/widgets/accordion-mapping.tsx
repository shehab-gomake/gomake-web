import { EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionMappingWidget } from "./section-mapping";
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
  return (
    <Accordion
      expanded={expanded === `panel_${index}`}
      onChange={handleChange(`panel_${index}`)}
      key={index}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={
          expanded === `panel_${index}` ? clasess.activeTabContainer : null
        }
      >
        <div style={clasess.headerAccordionContainer}>
          {expanded === `panel_${index}` ? (
            <EditIcon stroke={"rgba(18, 19, 58, 1)"} />
          ) : (
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
