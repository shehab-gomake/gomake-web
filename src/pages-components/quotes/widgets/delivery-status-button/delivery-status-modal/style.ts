import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      modalTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        color: "#000000",
        paddingBottom: "10px",
      },
      labelStyle: {
        color: "#344054",
        fontStyle: "normal",
        lineHeight: "20px",
        ...FONT_FAMILY.Inter(500, 14),
      },
      nextBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "var(--spacing-sm, 6px)",
        borderRadius: "var(--radius-md, 8px)",
        height: "35px",
      },
      conBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "var(--spacing-sm, 6px)",
        borderRadius: "var(--radius-md, 8px)",
        height: "40px",
        textTransform: "none" as "none",
      },
      clearBtn: {
        textTransform: "capitalize" as "capitalize",
        color: "#475467",
        width: "fit-content",
        ...FONT_FAMILY.Inter(600, 14),
      },
      menuPaperStyle: {
        marginTop: "4px",
        border: "1px solid #EAECF0",
        borderRadius: "8px",
        background: "#FFF",
        boxShadow:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      StyledSignatureCanvasWrapper: {
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        alignItems: "flex-start",
        alignSelf: "stretch",
        borderRadius: "8px",
        border: "1px solid #D0D5DD",
        background: "#FFF",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        width: "600px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
