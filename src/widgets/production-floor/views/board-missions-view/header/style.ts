import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, grayColor, secondColor, neutralColor } =
    useGomakeTheme();
  const classes = useMemo(() => {
    return {
      title: {
        ...FONT_FAMILY.Inter(600, 20),
        color: primaryColor(900),
      },
      divider: {
        width: "2px",
        backgroundColor: primaryColor(600),
        height: "60%",
        alignSelf: "center",
      },
      parameterLabel: {
        ...FONT_FAMILY.Inter(500, 14),
        fontSize: "clamp(12px, 3vw, 14px)",

        color: grayColor(500),
      },
      parameterValue: {
        ...FONT_FAMILY.Inter(600, 14),
        fontSize: "clamp(12px, 3vw, 14px)",

        color: grayColor(700),
      },
      productType: {
        ...FONT_FAMILY.Inter(700, 20),
        fontSize: "clamp(16px, 4vw, 20px)",
        color: secondColor(600),
      },
      newParameterLabel: {
        ...FONT_FAMILY.Inter(400, 16),
        fontSize: "clamp(14px, 3.5vw, 16px)",
        color: "#676B71",
      },
      newParameterValue: {
        ...FONT_FAMILY.Inter(500, 16),
        fontSize: "clamp(14px, 3.5vw, 16px)",
        color: grayColor(900),
      },
      labelsStyle: {
        ...FONT_FAMILY.Inter(600, 14),
        fontSize: "clamp(12px, 3vw, 14px)",

        color: "#FFFFFF",
        display: "inline-flex",
        padding: "var(--spacing-xs, 4px) var(--spacing-lg, 12px)",
        alignItems: "center",
        borderRadius: "var(--radius-full, 9999px)",
        background: primaryColor(500),
      },
      detailTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        fontSize: "clamp(12px, 3vw, 14px)",

        color: neutralColor(500),
        width: "max-content",
      },
      doneLabel: {
        borderRadius: "8px",
        display: "inline-flex",
        padding: "var(--spacing-xs, 4px) 10px",
        alignItems: "center",
        //Text style
        textAlign: "center" as "center",
        lineHeight: "20px",
        ...FONT_FAMILY.Inter(500, 14),
        fontSize: "clamp(12px, 3vw, 14px)",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
