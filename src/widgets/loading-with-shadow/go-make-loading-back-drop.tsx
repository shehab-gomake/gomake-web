import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { adaptLeft } from "@/utils/adapter";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface LoadingBackdropProps {
  loading: boolean;
  circular?: boolean; 
}

const GoMakeLoadingBackdrop: React.FC<LoadingBackdropProps> = ({ loading, circular = true }) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  return (
    <Backdrop sx={{ zIndex: 9999999999999999 }} open={loading}>
      {circular && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            ...adaptLeft(t("direction"), 15),
          }}
        >
          <CircularProgress style={{ color: primaryColor(500) }} />
        </div>
      )}
    </Backdrop>
  );
};

export { GoMakeLoadingBackdrop };
