import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (onUpload: boolean) => {
  const { primarySecondaryBlend, errorColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      pdfLabelStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primarySecondaryBlend(500),
        lineHeight: "15px",
      },
      pdfCellStyle: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "flex-start",
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primarySecondaryBlend(500),
        overflow: "hidden",
      },
      IconButtonStyle: {
        background: primarySecondaryBlend(300),
        width: "24px",
        height: "24px",
      },
      attachmentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      },
      attachmentStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "170px",
        height: "40px",
        borderRadius: "4px",
        boxShadow: onUpload ? "0px 1px 10px rgba(0, 0, 0, 0.08)" : "none",
      },
      removeBtn: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
        "&:hover": {
          backgroundColor: errorColor(100),
        },
        "& .MuiButton-startIcon": {
          margin: "0 8px",
        },
        textTransform: "lowercase",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
