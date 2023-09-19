import React from "react";
import { useRecoilValue } from "recoil";
import { Backdrop, CircularProgress } from "@mui/material";
import { loadgingState } from "@/store/loading";
import { adaptLeft, adaptRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const GomakeLoading = () => {
  const loading = useRecoilValue(loadgingState);
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  return (
    <Backdrop sx={{ zIndex: 9999999999999999 }} open={loading}>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          ...adaptLeft(t("direction"), 15),
        }}
      >
        <CircularProgress style={{ color: primaryColor(500) }} />
      </div>
    </Backdrop>
  );
};

export { GomakeLoading };
