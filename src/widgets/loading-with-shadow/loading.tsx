import React from "react";
import { useRecoilValue } from "recoil";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { loadingWithShadowState } from "@/store";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";

const GomakeLoadingWithShadow = () => {
  const loading = useRecoilValue(loadingWithShadowState);
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const { classes } = useStyle();
  return (
    <Backdrop sx={{ zIndex: 9999999999999999 }} open={loading}>
      <div
        style={classes.containerStyle}
      >
        <CircularProgress
          size="60px"
          thickness={2}
          style={{ color: primaryColor(600) }}
        />
        <Typography
          variant="h6"
          component="div"
          style={classes.textStyle}
        >
          {t("Loading")}
        </Typography>
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
          <div style={classes.dot}></div>
          <div style={classes.dot}></div>
          <div style={classes.dot}></div>
        </div>
      </div>
    </Backdrop>
  );
};

export { GomakeLoadingWithShadow };
