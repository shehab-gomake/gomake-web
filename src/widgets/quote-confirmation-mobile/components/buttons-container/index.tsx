import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";

const ButtonsConfirmContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      <SecondaryButton
          variant="contained"
          style={classes.btnStyle}
          >{t("sales.quote.approveOffer")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}
          >{t("sales.quote.print")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}>
          {t("sales.quote.attachFiles")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.rejectBtn}>
          {t("sales.quote.rejectOffer")}
        </SecondaryButton>
    </div>
  );
};

export { ButtonsConfirmContainer };
