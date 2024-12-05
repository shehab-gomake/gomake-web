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
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
