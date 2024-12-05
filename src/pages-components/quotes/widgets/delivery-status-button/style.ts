import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { toRgba } from "@/utils/helpers";

const useStyle = ({ color }) => {
  const { t } = useTranslation();
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      spanStyle: {
        display: "flex",
        cursor: "pointer",
        color: color || primaryColor(500),
        backgroundColor: toRgba(color || primaryColor(50), 0.1),
        width: "fit-content",
        height: "fit-content",
        padding: "4px 20px",
        ...FONT_FAMILY.Lexend(500, 13),
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as "center",
        gap: "9px",
        flexShrink: 0,
        borderRadius: "var(--radius-full, 9999px)",
        border: `1px solid ${color}`,
      },
      menuText: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#292D32",
        fontStyle: "normal",
        lineHeight: "20px",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "5px 12px",
        gap: 8,
      },
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
      menuPaperStyle: {
        marginTop: "4px",
        border: "1px solid #EAECF0",
        borderRadius: "8px",
        background: "var(--Colors-Background-bg-primary, #FFF)",
        boxShadow:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
