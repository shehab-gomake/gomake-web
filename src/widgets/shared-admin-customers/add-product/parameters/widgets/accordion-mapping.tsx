import { EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionMappingWidget } from "./section-mapping";
const AccordionMappingWidget = ({
  expanded,
  index,
  clasess,
  handleChange,
  subSection,
  onOpenModal,
  section,
  updatedProductParameterHidden,
  updatedProductParameteRequierd,
  _renderParameterType,
  relatedParameters,
}) => {
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
          index={index}
          clasess={clasess}
          subSection={subSection}
          onOpenModal={onOpenModal}
          section={section}
          updatedProductParameterHidden={updatedProductParameterHidden}
          updatedProductParameteRequierd={updatedProductParameteRequierd}
          _renderParameterType={_renderParameterType}
          relatedParameters={relatedParameters}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionMappingWidget };
