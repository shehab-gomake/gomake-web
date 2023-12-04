import { ArrowDownWithSquare, MoreCircleIcon } from "@/icons";
import { IAccordionTable } from "./interface";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Fade } from "@mui/material";
import { useAccordionStyle } from "./accordion-style";

const AccordionTable = ({
  title,
  isDefault = false,
  children,
  onclickOpenMenu,
}: IAccordionTable) => {
  const { classes } = useAccordionStyle();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerTableContainer}>
        <div style={classes.headerTitleStyle}>
          <div style={classes.titleStyle}>{title}</div>
          {isDefault && (
            <div style={classes.defaultStyle}>
              {t("customers.modal.default")}
            </div>
          )}
        </div>
        <div style={classes.headerTitleStyle}>
          <div style={classes.iconContainer} onClick={onclickOpenMenu}>
            <MoreCircleIcon />
          </div>
          <div style={classes.iconContainer} onClick={handleChange}>
            <ArrowDownWithSquare />
          </div>
        </div>
      </div>
      {checked && (
        <Fade in={checked}>
          <div style={classes.chidrenTableContainer}>{children}</div>
        </Fade>
      )}
    </div>
  );
};

export { AccordionTable };
