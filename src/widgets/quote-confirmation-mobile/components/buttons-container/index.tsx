import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { AttachIcon } from "@/components/icons/attach-icon";


const ButtonsConfirmContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      <SecondaryButton
          variant="contained"
          style={classes.btnStyle}>{t("Approve Offer")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}>{t("Partially Approved")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}>{t("Print")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.btnStyle}>
          {t("Attach File")}
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          style={classes.rejectBtn}>
          {t("Reject Offer")}
        </SecondaryButton>
    </div>
  );
};

export { ButtonsConfirmContainer };
