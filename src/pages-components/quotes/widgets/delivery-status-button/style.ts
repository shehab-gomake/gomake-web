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
        // border:
        //   "1px solid var(--Component-colors-Components-Buttons-Primary-button-primary-border, #2E3092)",
        // background:
        //   "var(--Component-colors-Components-Buttons-Primary-button-primary-bg, #2E3092)",
        // boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        height: "35px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
