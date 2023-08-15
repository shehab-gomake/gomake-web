import { EditIcon } from "@/icons";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useTranslation } from "react-i18next";

const AccordionMappingWidget = ({
  clasess,
  expanded,
  index,
  handleChange,
  subSection,
  section,
  _renderParameterType,
}: any) => {
  const { t } = useTranslation();
  return (
    <Accordion
      expanded={expanded === `panel_${index}`}
      onChange={handleChange(`panel_${index}`)}
      key={index}
    >
      <AccordionSummary
        style={
          expanded === `panel_${index}` ? clasess.activeTabContainer : null
        }
      >
        <div style={clasess.headerAccordionContainer}>
          <EditIcon />
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
            return (
              <div key={index}>
                {!parameter?.isHidden ? (
                  <div style={clasess.parameterContainer}>
                    <div style={clasess.parameterLabelStyle}>
                      {parameter?.name}
                      {parameter?.isRequired ? (
                        <span style={clasess.spanRequierd}> *</span>
                      ) : null}
                    </div>
                    <div style={clasess.renderParameterTypeContainer}>
                      {_renderParameterType(parameter, subSection, section)}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export { AccordionMappingWidget };
