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
        color: grayColor(500),
      },
      parameterValue: {
        ...FONT_FAMILY.Inter(600, 14),
        color: grayColor(700),
      },
      productType: {
        ...FONT_FAMILY.Inter(700, 20),
        color: secondColor(600),
      },
      newParameterLabel: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#98A2B3",
      },
      newParameterValue: {
        ...FONT_FAMILY.Inter(500, 16),
        color: grayColor(900),
      },
      labelsStyle: {
        ...FONT_FAMILY.Inter(600, 14),
        color: "#FFFFFF",
        display: "inline-flex",
        padding: "var(--spacing-xs, 4px) var(--spacing-lg, 12px)",
        alignItems: "center",
        borderRadius: "var(--radius-full, 9999px)",
        background: primaryColor(500),
      },
      detailTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(500),
        width: "max-content",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
