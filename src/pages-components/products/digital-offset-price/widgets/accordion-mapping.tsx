import { EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const AccordionMappingWidget = ({
  clasess,
  expanded,
  index,
  handleChange,
  subSection,
  section,
  _renderParameterType,
  _getParameter,
}: any) => {
  const { t } = useTranslation();
  return (
    <Accordion
      expanded={expanded === `panel_${index}`}
      onChange={handleChange(`panel_${index}`)}
      key={index}
      sx={{ borderBottom: "0px solid red" }}
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
        <div style={clasess.parametersContainer}>
          {subSection?.parameters?.map((parameter, index) => {
            const value = _getParameter(parameter, subSection, section);
            return (
              <div key={index}>
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
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionMappingWidget };
