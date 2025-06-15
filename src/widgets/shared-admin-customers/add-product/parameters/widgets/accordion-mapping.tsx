import { EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SectionMappingWidget } from "./section-mapping";
const AccordionMappingWidget = ({
  expanded,
  index,
  classes,
  handleChange,
  subSection,
  onOpenModal,
  section,
  updatedProductParameterHidden,
  updatedProductParameteRequierd,
  updatedProductParameteLocked,
  _renderParameterType,
  relatedParameters,
  updatedProductParameterShowToClient,
  onOpenExternalIdsModal,
  getProductById,
  removeProductParamete
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
          expanded === `panel_${index}` ? classes.activeTabContainer : null
        }
      >
        <div style={classes.headerAccordionContainer}>
          {expanded === `panel_${index}` ? (
            <EditIcon stroke={"rgba(18, 19, 58, 1)"} />
          ) : (
            <EditIcon />
          )}

          <div
            style={
              expanded === `panel_${index}`
                ? classes.subSectionAccordionActiveStyle
                : classes.subSectionAccordionStyle
            }
          >
            {subSection.name}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <SectionMappingWidget
          index={index}
          classes={classes}
          subSection={subSection}
          onOpenModal={onOpenModal}
          onOpenExternalIdsModal={onOpenExternalIdsModal}
          section={section}
          updatedProductParameterHidden={updatedProductParameterHidden}
          updatedProductParameteRequierd={updatedProductParameteRequierd}
          _renderParameterType={_renderParameterType}
          relatedParameters={relatedParameters}
          updatedProductParameteLocked={updatedProductParameteLocked}
          updatedProductParameterShowToClient={
            updatedProductParameterShowToClient
          }
          getProductById={getProductById}
          removeProductParamete={removeProductParamete}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionMappingWidget };
