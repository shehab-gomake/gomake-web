import React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import Textarea from '@mui/joy/Textarea';


const TextAreasContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.mainContainer}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" , width:"70%"}}>
        <h3 style={classes.headerStyle}>{t("customers.modal.remarks")}</h3>
        <Textarea
          color="neutral"
          disabled={false}
          minRows={4}
          placeholder={t("sales.quote.textHere")}
          variant="outlined"
          sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px", boxShadow: "none" }}
        />
      </div>
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "8px" , width:"70%" }}>
        <h3 style={classes.headerStyle}>{t("Seal name :")}</h3>
        <GomakeTextInput
          style={classes.inputStyle}
          value={"Ahmad"}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" , width:"70%" }}>
        <h3 style={classes.headerStyle}>{t("Date of signature:")}</h3>
        <GomakeTextInput
          style={classes.inputStyle}
          value={"24, Oct 2023"} />
      </div> */}
    </div>
  );
};

export { TextAreasContainer };
